import { eq } from "drizzle-orm";
import { BASE_THEMES, type ThemeKeys } from "~/lib/utils";
import { editVisualCustomizationSchema, type ThemeType, users } from "~/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const visualCustomizationRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.users.findFirst({
      where: (t, op) => op.eq(t.id, ctx.userId),
      columns: {
        id: true,
        image: true,
        bio: true,
        theme: true,
        pageLayout: true,
        avatarShape: true,
        profileHeader: true,
      },
    });
  }),

  edit: protectedProcedure.input(editVisualCustomizationSchema).mutation(async ({ ctx, input }) => {
    const themeKey = input.theme?.themeKey;
    let templateTheme: ThemeType | undefined;

    if (themeKey !== "custom") {
      templateTheme = BASE_THEMES[themeKey as ThemeKeys];
    }

    return ctx.db
      .update(users)
      .set({
        ...input,
        theme: themeKey !== "custom" ? templateTheme : input.theme,
      })
      .where(eq(users.id, ctx.userId))
      .returning();
  }),
});
