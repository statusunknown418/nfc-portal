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
    .input(z.object({ hide: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .update(users)
        .set({
          hasContactInfoLocked: input.hide,
        })
        .where(eq(users.id, ctx.session.user.id))
        .returning();
    }),
  get: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.users.findFirst({
      where: (t, op) => op.and(op.eq(t.id, ctx.session.user.id)),
      columns: {
        id: true,
        contactJSON: true,
        hasContactInfoLocked: true,
        onboardingStep: true,
        hasCompletedOnboarding: true,
      },
    });
  }),
  edit: protectedProcedure.input(editViewerContactSchema).mutation(async ({ ctx, input }) => {
    const [updatedContact] = await Promise.all([
      ctx.db
        .update(users)
        .set({
          contactJSON: input,
        })
        .where(eq(users.id, ctx.session.user.id))
        .returning(),
      ctx.db
        .update(users)
        .set({
          name: `${input.name?.first} ${input.name?.last}`,
        })
        .where(eq(users.id, ctx.session.user.id)),
    ]);

    return updatedContact;
  }),
});
