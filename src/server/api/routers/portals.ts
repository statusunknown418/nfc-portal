import { and, eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { z } from "zod";
import { PORTAL_KEY } from "~/middleware";
import { links, userProfileSchema, users } from "~/server/db/schema";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const portalsRouter = createTRPCRouter({
  edit: protectedProcedure.input(userProfileSchema).mutation(async ({ ctx, input }) => {
    return ctx.db.update(users).set(input).where(eq(users.id, ctx.userId)).returning();
  }),

  get: publicProcedure
    /**
     * WARNING: DO NOT USE THIS OUTSIDE OF PROTECTED PAGES LIKE ['/admin', '/business', '/onboarding']
     */
    .input(z.object({ username: z.string(), bypass: z.boolean().optional().default(false) }))
    .query(async ({ ctx, input }) => {
      const cookiePassword = cookies().get(PORTAL_KEY);

      const data = await ctx.db.query.users.findFirst({
        where: and(eq(users.username, input.username), eq(users.hasPageActive, true)),
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

      /** Used for overriding the password on the admin page preview */
      if (!!input.bypass) {
        return {
          data,
          unlocked: true,
        };
      }
      /** ----------------------------------------------------------- */

      if (!!cookiePassword && data?.pageHashKey === cookiePassword.value) {
        return {
          data,
          unlocked: true,
        };
      }

      return {
        data,
        unlocked: false,
      };
    }),
  removeJoinBanner: protectedProcedure.mutation(async ({}) => {
    cookies().set("nfc-portal-join-page", "false");
    return {
      success: true,
    };
  }),
});
