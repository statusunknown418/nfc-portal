import { createId } from "@paralleldrive/cuid2";
import { z } from "zod";
import { users } from "~/server/db/schema";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { eq } from "drizzle-orm";

export const viewersRouter = createTRPCRouter({
  /**
   * @description should only be used when the user is attempting to buy an NFC card
   */
  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string(),
        username: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .insert(users)
        .values({
          ...input,
          pageHashKey: createId(),
        })
        .onConflictDoUpdate({
          set: input,
          target: users.id,
        });
    }),
  get: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.users.findFirst({
      where: (t, op) => op.and(op.eq(t.id, ctx.session.user.id)),
      columns: {
        id: true,
        name: true,
        email: true,
        username: true,
        pageHashKey: true,
        image: true,
        hasPurchasedCard: true,
      },
    });
  }),
  setOnboardingStep: protectedProcedure
    .input(
      z.object({
        step: z.enum(["contact", "portal", "nfc-card", "purchase", "finale"]).default("contact"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(users)
        .set({ onboardingStep: input.step })
        .where(eq(users.id, ctx.session.user.id));

      return { success: true };
    }),
  checkUsernameAvailability: publicProcedure
    .input(z.string().optional())
    .query(async ({ ctx, input }) => {
      if (!input) {
        return;
      }

      const username = input.toLowerCase();

      const user = await ctx.db.query.users.findFirst({
        where: (t, op) => op.eq(t.username, username),
      });

      return { available: !user };
    }),
});
