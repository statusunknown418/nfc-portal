import { z } from "zod";
import { type ThemeType } from "../db/schema";

export const editViewerContactSchema = z.object({
  profileHeader: z.string().optional(),
  url: z.string().optional(),
  jobTitle: z.string().optional(),
  notes: z.string().optional(),
  company: z
    .object({
      name: z.string().optional(),
      department: z.string().optional(),
    })
    .optional(),
  social: z
    .array(
      z.object({
        link: z.string().optional(),
        type: z
          .enum(["TWITTER", "FACEBOOK", "INSTAGRAM", "LINKEDIN", "GITHUB", "YOUTUBE"])
          .optional(),
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
    .max(5)
    .optional(),
  name: z.object({
    last: z.string().optional(),
    first: z.string(),
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
    .max(5)
    .optional(),
  email: z
    .array(
      z.object({
        link: z.string().email(),
        type: z.enum(["PREF", "WORK", "HOME"]),
      }),
    )
    .max(5)
    .optional(),
});

export type EditViewerContactSchema = z.infer<typeof editViewerContactSchema>;

export const themeSchema: z.ZodType<ThemeType> = z.object({
  themeKey: z.enum([
    "default",
    "dark",
    "minimal",
    "crazy",
    "blurry",
    "stripes",
    "custom",
    "modern",
  ]),
  colorScheme: z.enum(["light", "dark"]),
  colors: z.object({
    foreground: z.string(),
    background: z.string(),
    border: z.string(),
    subtle: z.string(),
  }),
  buttons: z.object({
    variant: z.enum(["pill", "rounded", "square", "small-radius"]),
    textColor: z.string(),
    background: z.string(),
    borderColor: z.string().optional(),
    borderStyle: z.enum(["solid", "dashed", "dotted", "double"]),
    rounding: z.custom<`${number}px`>(),
    fontStyle: z.enum(["normal", "italic"]),
    fontWeight: z.enum([
      "normal",
      "bold",
      "100",
      "200",
      "300",
      "400",
      "500",
      "600",
      "700",
      "800",
      "900",
    ]),
  }),
});

export const saveNFCPreferencesSchema = z.object({
  showName: z.boolean(),
  showJobTitle: z.boolean(),
  showCompanyName: z.boolean(),
  companyNameOnFront: z.boolean(),
  nameOnFront: z.boolean(),
  jobTitleOnFront: z.boolean(),
  showCompanyLogo: z.boolean(),
  companyLogoOnFront: z.boolean(),
  cardVariant: z.enum(["basic", "custom", "metallic"]),
  cardTemplate: z.string().optional(),
  companyLogoURL: z.string().url().optional(),
  cardImageFront: z.string().url().optional(),
  cardImageBack: z.string().url().optional(),
  includeQRCode: z.boolean(),
});

export type SaveNFCPreferences = z.infer<typeof saveNFCPreferencesSchema>;
