import { and, eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { z } from "zod";
import { PORTAL_KEY } from "~/lib/utils";
import { links, userProfileSchema, users } from "~/server/db/schema";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const portalsRouter = createTRPCRouter({
  edit: protectedProcedure.input(userProfileSchema).mutation(async ({ ctx, input }) => {
    return ctx.db.update(users).set(input).where(eq(users.id, ctx.userId)).returning();
  }),

  get: publicProcedure
    .input(z.object({ username: z.string(), fallbackPassword: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const cookiePassword = input.fallbackPassword ?? cookies().get(PORTAL_KEY)?.value;

      const data = await ctx.db.query.users.findFirst({
        where: and(eq(users.username, input.username)),
        with: {
          links: {
            where: and(eq(links.isActive, true)),
            orderBy: (t, op) => op.asc(t.position),
          },
        },
      });

      if (!data) {
        return {
          data: null,
          unlocked: false,
        };
      }

      if (!cookiePassword || data?.pageHashKey !== cookiePassword) {
        return {
          data,
          unlocked: false,
        };
      }

      return {
        data,
        unlocked: true,
      };
    }),
  removeJoinBanner: protectedProcedure.mutation(async ({}) => {
    cookies().set("nfc-portal-join-page", "false");
    return {
      success: true,
    };
  }),
});
