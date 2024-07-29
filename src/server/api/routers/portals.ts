import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { links, userProfileSchema, users } from "~/server/db/schema";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { cookies } from "next/headers";
import { PORTAL_KEY } from "~/middleware";

export const portalsRouter = createTRPCRouter({
  edit: protectedProcedure.input(userProfileSchema).mutation(async ({ ctx, input }) => {
    return ctx.db.update(users).set(input).where(eq(users.id, ctx.session.user.id)).returning();
  }),

  get: publicProcedure.input(z.object({ username: z.string() })).query(async ({ ctx, input }) => {
    const cookiePassword = cookies().get(PORTAL_KEY);

    const data = await ctx.db.query.users.findFirst({
      where: and(eq(users.username, input.username), eq(users.isPageActive, true)),
      with: {
        links: {
          where: and(eq(links.isActive, true)),
        },
      },
    });

    if (!data) {
      return {
        data: null,
        unlocked: false,
      };
    }

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
});
