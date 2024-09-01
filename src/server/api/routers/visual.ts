import { eq } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import {
  DEFAULT_THEME,
  editVisualCustomizationSchema,
  type ThemeType,
  users,
} from "~/server/db/schema";

export enum ThemeKeys {
  default = "default",
  dark = "dark",
  minimal = "minimal",
  crazy = "crazy",
  blurry = "blurry",
  stripes = "stripes",
}

export const BASE_THEMES: Record<ThemeKeys, ThemeType> = {
  default: DEFAULT_THEME,
  dark: {
    themeKey: "dark",
    colorScheme: "dark",
    foregroundColor: "#ffffff",
    background: {
      type: "pattern",
      background: "linear-gradient(to bottom, #1a202c, #1a202c)",
    },
    buttons: {
      variant: "pill",
      textColor: "#ffffff",
      background: "#4f46e5",
      border: "1px solid #ffffff",
      rounding: "9999px",
    },
  },
  minimal: {
    themeKey: "minimal",
    colorScheme: "light",
    foregroundColor: "#000000",
    background: {
      type: "flat",
      background: "#f8f8fc",
    },
    buttons: {
      variant: "pill",
      textColor: "#f8f8fc",
      background: "#4f46e5",
      border: "1px solid transparent",
      rounding: "9999px",
    },
  },
  crazy: {
    themeKey: "crazy",
    colorScheme: "light",
    foregroundColor: "#000000",
    background: {
      type: "flat",
      background: "#f8f8fc",
    },
    buttons: {
      variant: "pill",
      textColor: "#f8f8fc",
      background: "#4f46e5",
      border: "1px solid transparent",
      rounding: "9999px",
    },
  },
  blurry: {
    themeKey: "blurry",
    colorScheme: "light",
    foregroundColor: "#000000",
    background: {
      type: "flat",
      background: "#f8f8fc",
    },
    buttons: {
      variant: "pill",
      textColor: "#f8f8fc",
      background: "#4f46e5",
      border: "1px solid transparent",
      rounding: "9999px",
    },
  },
  stripes: {
    themeKey: "stripes",
    colorScheme: "light",
    foregroundColor: "#000000",
    background: {
      type: "flat",
      background: "#f8f8fc",
    },
    buttons: {
      variant: "pill",
      textColor: "#f8f8fc",
      background: "#4f46e5",
      border: "1px solid transparent",
      rounding: "9999px",
    },
  },
};

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
        avatarShape: true,
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
      .where(eq(users.id, ctx.session.user.id));
  }),
});
