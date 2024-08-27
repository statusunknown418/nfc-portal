import { eq } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { editVisualCustomizationSchema, users } from "~/server/db/schema";

export const visualCustomizationRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.users.findFirst({
      where: (t, op) => op.eq(t.id, ctx.session.user.id),
      columns: {
        id: true,
        image: true,
        bio: true,
        theme: true,
        pageLayout: true,
      },
    });
  }),

  edit: protectedProcedure.input(editVisualCustomizationSchema).mutation(async ({ ctx, input }) => {
    return ctx.db.update(users).set(input).where(eq(users.id, ctx.session.user.id));
  }),
});
