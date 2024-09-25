import { TRPCError } from "@trpc/server";
import { eq, inArray, sql, type SQL } from "drizzle-orm";
import { z } from "zod";
import { arrayMove } from "~/lib/utils";
import { links, newLinkSchema } from "~/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const linksRouter = createTRPCRouter({
  all: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.links.findMany({
      where: (t, op) => op.eq(t.userId, ctx.userId),
      orderBy: (t, op) => op.asc(t.position),
    });
  }),

  new: protectedProcedure.input(newLinkSchema).mutation(async ({ ctx, input }) => {
    const userId = ctx.userId;

    const [newLInk] = await ctx.db
      .insert(links)
      .values({
        ...input,
        userId,
      })
      .returning();

    return newLInk;
  }),

  toggleActive: protectedProcedure
    .input(z.object({ id: z.number(), active: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      if (!input.id) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "No id provided" });
      }

      return ctx.db.update(links).set({ isActive: input.active }).where(eq(links.id, input.id));
    }),

  edit: protectedProcedure.input(newLinkSchema).mutation(async ({ ctx, input }) => {
    if (!input.id) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "No id provided" });
    }

    if (!!input.thumbnail && !input.userId) {
      await ctx.db.update(links).set({ thumbnail: input.thumbnail }).where(eq(links.id, input.id));
    }

    await ctx.db
      .update(links)
      .set({
        ...input,
        userId: ctx.userId,
      })
      .where(eq(links.id, input.id));

    return {
      success: true,
    };
  }),

  reorder: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        newPosition: z.number(),
        prevPositionsIds: z.array(z.number()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!input.id) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "No id provided" });
      }

      const currentPosition = input.prevPositionsIds.indexOf(input.id);
      const newPositions = arrayMove(input.prevPositionsIds, currentPosition, input.newPosition);

      const newItems = newPositions.map((id, index) => ({
        id,
        position: index,
      }));

      const sqlChunks: SQL[] = [];
      sqlChunks.push(sql`(case`);

      for (const cases of newItems) {
        sqlChunks.push(sql`when ${links.id} = ${cases.id} then ${cases.position}`);
      }

      sqlChunks.push(sql`end)`);

      const finalSql: SQL = sql.join(sqlChunks, sql.raw(" "));

      return ctx.db
        .update(links)
        .set({ position: finalSql })
        .where(inArray(links.id, input.prevPositionsIds))
        .returning();
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (!input.id) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "No id provided" });
      }

      return ctx.db.delete(links).where(eq(links.id, input.id)).returning();
    }),

  archive: protectedProcedure
    .input(z.object({ id: z.array(z.number()) }))
    .mutation(async ({ ctx, input }) => {
      if (!input.id) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "No id provided" });
      }

      return ctx.db
        .update(links)
        .set({ isActive: false })
        .where(inArray(links.id, input.id))
        .returning();
    }),
});
