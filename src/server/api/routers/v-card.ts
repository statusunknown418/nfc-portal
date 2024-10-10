import { eq } from "drizzle-orm";
import { z } from "zod";
import { users } from "~/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { editViewerContactSchema } from "../schemas.zod";

export const vCardsRouter = createTRPCRouter({
  hasContactEnabled: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.users.findFirst({
      where: (t, op) => op.and(op.eq(t.id, ctx.userId)),
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
        .where(eq(users.id, ctx.userId))
        .returning();
    }),
  get: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.users.findFirst({
      where: (t, op) => op.and(op.eq(t.id, ctx.userId)),
      columns: {
        id: true,
        contactJSON: true,
        hasContactInfoLocked: true,
        profileHeader: true,
      },
    });
  }),
  edit: protectedProcedure
    .input(editViewerContactSchema)
    .mutation(async ({ ctx, input: { profileHeader, ...contact } }) => {
      const [updatedContact] = await Promise.all([
        ctx.db
          .update(users)
          .set({
            contactJSON: contact,
            profileHeader,
          })
          .where(eq(users.id, ctx.userId))
          .returning(),
        ctx.db
          .update(users)
          .set({
            name: `${contact.name?.first} ${contact.name?.last}`,
          })
          .where(eq(users.id, ctx.userId)),
      ]);

      return updatedContact;
    }),
});
