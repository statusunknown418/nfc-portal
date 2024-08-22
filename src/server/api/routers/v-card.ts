import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { users } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export const editViewerContactSchema = z.object({
  contactJSON: z.object({
    url: z.string().optional(),
    jobTitle: z.string().optional(),
    notes: z.string(),
    company: z
      .object({
        name: z.string(),
        department: z.string().optional(),
      })
      .optional(),
    social: z
      .array(
        z.object({
          link: z.string(),
          type: z.enum(["TWITTER", "FACEBOOK", "INSTAGRAM", "LINKEDIN", "GITHUB", "YOUTUBE"]),
          handle: z.string().optional(),
        }),
      )
      .optional(),
    phoneNumbers: z
      .array(
        z.object({
          number: z.string(),
          type: z
            .enum([
              "PREF",
              "WORK",
              "HOME",
              "VOICE",
              "FAX",
              "MSG",
              "CELL",
              "PAGER",
              "BBS",
              "CAR",
              "MODEM",
              "VIDEO",
            ])
            .optional(),
        }),
      )
      .optional(),
    name: z.object({
      last: z.string().optional(),
      first: z.string().optional(),
      additional: z.string().optional(),
      prefix: z.string().optional(),
      suffix: z.string().optional(),
    }),
    address: z
      .array(
        z.object({
          label: z.string().optional(),
          extended: z.string().optional(),
          street: z.string().optional(),
          city: z.string().optional(),
          region: z.string().optional(),
          postalCode: z.string().optional(),
          country: z.string().optional(),
          type: z.enum(["DOM", "INTL", "POSTAL", "PARCEL", "HOME", "WORK"]).optional(),
        }),
      )
      .optional(),
    email: z
      .array(
        z.object({
          link: z.string(),
          type: z.enum(["PREF", "WORK", "HOME"]),
        }),
      )
      .optional(),
  }),
});

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
