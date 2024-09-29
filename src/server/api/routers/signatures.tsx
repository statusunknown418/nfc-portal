import { createTRPCRouter, protectedProcedure } from "../trpc";

export const signaturesRouter = createTRPCRouter({
  templates: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.users.findFirst({
      where: (t, op) => op.eq(t.id, ctx.userId),
      columns: {
        id: true,
        username: true,
        image: true,
        contactJSON: true,
      },
    });
  }),
});
