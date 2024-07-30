import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { users } from "~/server/db/schema";
import { createId } from "@paralleldrive/cuid2";

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
    });
  }),
});
