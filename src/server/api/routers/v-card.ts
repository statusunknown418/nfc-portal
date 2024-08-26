import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { users } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { editViewerContactSchema } from "../schemas.zod";

export const vCardsRouter = createTRPCRouter({
  hasContactEnabled: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.users.findFirst({
      where: (t, op) => op.and(op.eq(t.id, ctx.session.user.id)),
      columns: {
        hasContactInfoLocked: true,
        id: true,
      },
    });
  }),
  toggleVisibility: protectedProcedure
    .input(z.object({ enable: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .update(users)
        .set({
          hasContactInfoLocked: input.enable,
        })
        .where(eq(users.id, ctx.session.user.id))
        .returning();
    }),
  get: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.users.findFirst({
      where: (t, op) => op.and(op.eq(t.id, ctx.session.user.id)),
      columns: {
        contactJSON: true,
        id: true,
      },
    });
  }),
  edit: protectedProcedure.input(editViewerContactSchema).mutation(async ({ ctx, input }) => {
    return ctx.db
      .update(users)
      .set({
        contactJSON: input.contactJSON,
      })
      .where(eq(users.id, ctx.session.user.id))
      .returning();
  }),
});
