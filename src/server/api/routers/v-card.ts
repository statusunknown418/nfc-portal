import { eq } from "drizzle-orm";
import sharp from "sharp";
import { z } from "zod";
import { users } from "~/server/db/schema";
import { editViewerContactSchema } from "../schemas.zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

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
  get: protectedProcedure
    .input(
      z
        .object({
          includeImagePalette: z.boolean().default(false),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.query.users.findFirst({
        where: (t, op) => op.and(op.eq(t.id, ctx.userId)),
        columns: {
          id: true,
          contactJSON: true,
          hasContactInfoLocked: true,
          profileHeader: true,
          image: true,
          bio: true,
        },
      });

      if (!input?.includeImagePalette)
        return {
          ...data,
          dominantColor: null,
        };

      if (!data?.image) {
        return {
          ...data,
          dominantColor: null,
        };
      }

      const image2Base64 = await (await fetch(data.image)).arrayBuffer();

      const {
        dominant: { r, g, b },
      } = await sharp(image2Base64).stats();

      return {
        ...data,
        dominantColor: `rgb(${r}, ${g}, ${b})`,
      };
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
