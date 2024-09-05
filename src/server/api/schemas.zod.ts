import { z } from "zod";

export const editViewerContactSchema = z.object({
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
    .max(3)
    .optional(),
});

export type EditViewerContactSchema = z.infer<typeof editViewerContactSchema>;

export const themeSchema = z.object({
  themeKey: z.enum(["default", "dark", "minimal", "crazy", "blurry", "stripes", "custom"]),
  colorScheme: z.enum(["light", "dark"]),
  foregroundColor: z.string(),
  background: z.object({
    type: z.enum(["flat", "pattern", "image"]),
    background: z.string(),
  }),
  buttons: z.object({
    variant: z.enum(["pill", "rounded", "square"]),
    textColor: z.string(),
    background: z.string(),
    border: z.string().optional(),
  }),
});
