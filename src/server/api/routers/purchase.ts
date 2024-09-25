import { TRPCError } from "@trpc/server";
import { Preference } from "mercadopago";
import { z } from "zod";
import { env } from "~/env";
import { payments } from "~/lib/payments";
import { users, type CardVariant } from "~/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { eq } from "drizzle-orm";

const PRICES: Record<CardVariant, number> = {
  basic: 50,
  custom: 70,
  metallic: 90,
};

export const purchasesRouter = createTRPCRouter({
  withPreferences: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        cardVariant: z.enum(["basic", "custom", "metallic"]),
        metadata: z.record(z.unknown()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const paymentData = await new Preference(payments).create({
        body: {
          metadata: {
            app_user_id: ctx.userId,
            user_email: ctx.auth.sessionClaims.email,
            ...input.metadata,
          },
          back_urls: {
            success:
              env.NODE_ENV === "development"
                ? "http://localhost:3000/onboarding?step=finale&payment=success"
                : "https://chronosecrets.app/onboarding?step=finale&payment=success",
          },
          items: [
            {
              quantity: 1,
              id: ctx.userId,
              unit_price: PRICES[input.cardVariant],
              title: input.title,
              description: input.description,
            },
          ],
          shipments: {
            receiver_address: {
              street_name: input.metadata.shippingAddress as string,
            },
          },
        },
      });

      if (!paymentData) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Payment failed",
        });
      }

      return paymentData;
    }),
  getStatus: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.users.findFirst({
      where: eq(users.id, ctx.userId),
      columns: {
        id: true,
        cardVariant: true,
        cardShippingStatus: true,
        hasPurchasedCard: true,
      },
    });
  }),
});
