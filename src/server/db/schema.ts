import { createId } from "@paralleldrive/cuid2";
import { relations, sql } from "drizzle-orm";
import { index, int, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { type AdapterAccount } from "next-auth/adapters";
import { z } from "zod";
import { BASE_THEMES } from "~/lib/utils";
import { type SaveNFCPreferences, themeSchema } from "../api/schemas.zod";

export const linkTypes = ["social", "deployable", "basic"] as const;
export type LinkType = (typeof linkTypes)[number];
export const linkLayoutTypes = ["basic", "featured"] as const;
export type LinkLayoutType = (typeof linkLayoutTypes)[number];

export const pageLayoutTypes = ["basic", "grid", "hero"] as const;
export type PageLayoutType = (typeof pageLayoutTypes)[number];

export const cardVariants = ["basic", "custom", "metallic"] as const;
export type CardVariant = (typeof cardVariants)[number];

export type ThemeType = {
  themeKey: "default" | "dark" | "minimal" | "crazy" | "blurry" | "stripes" | "modern" | "custom";
  colorScheme: "light" | "dark";
  colors: {
    foreground: string;
    background: string;
    border: string;
    subtle: string;
  };
  buttons: {
    variant: "pill" | "rounded" | "square" | "small-radius";
    textColor: string;
    background: string;
    rounding: `${number}px`;
    borderColor?: string;
    borderStyle: "solid" | "dashed" | "dotted" | "double";
    fontStyle: "normal" | "italic";
    fontWeight:
      | "normal"
      | "bold"
      | "100"
      | "200"
      | "300"
      | "400"
      | "500"
      | "600"
      | "700"
      | "800"
      | "900";
  };
};

export const links = sqliteTable("links", {
  id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  displayText: text("display_text"),
  description: text("description"),
  buttonLabel: text("button_label").default("Go to link"),
  url: text("url"),
  thumbnail: text("thumbnail"),
  isActive: int("active", { mode: "boolean" }).default(true),
  type: text("type", { enum: linkTypes }).notNull().default("basic"),
  layout: text("layout", { enum: linkLayoutTypes }).notNull().default("basic"),
  position: int("position", { mode: "number" }).notNull().default(0),
  createdAt: int("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: int("updated_at", { mode: "timestamp" }).$onUpdate(() => new Date()),
  userId: text("user_id", { length: 255 })
    .notNull()
    .references(() => users.id),
});

export const newLinkSchema = createInsertSchema(links, {
  url: z.string().url().nullable(),
  type: z.custom<LinkType>().default("basic"),
  buttonLabel: z.string().default("Go to link"),
  userId: z.undefined(),
});

export type NewLinkSchema = z.infer<typeof newLinkSchema>;

export const linksRelations = relations(links, ({ one }) => ({
  user: one(users, { fields: [links.userId], references: [users.id] }),
}));

export type ContactVCardType = {
  url?: string;
  jobTitle?: string;
  notes?: string;
  company?: {
    name?: string;
    department?: string;
  };
  social?: {
    link?: string;
    type?: "TWITTER" | "FACEBOOK" | "INSTAGRAM" | "LINKEDIN" | "GITHUB" | "YOUTUBE";
    handle?: string;
  }[];
  phoneNumbers?: {
    number: string;
    type?:
      | "PREF"
      | "WORK"
      | "HOME"
      | "VOICE"
      | "FAX"
      | "MSG"
      | "CELL"
      | "PAGER"
      | "BBS"
      | "CAR"
      | "MODEM"
      | "VIDEO";
  }[];
  name: {
    last?: string;
    first?: string;
    additional?: string;
    prefix?: string;
    suffix?: string;
  };
  address?: {
    label?: string;
    extended?: string;
    street?: string;
    city?: string;
    region?: string;
    postalCode?: string;
    country?: string;
    type?: "DOM" | "INTL" | "POSTAL" | "PARCEL" | "HOME" | "WORK";
  }[];
  email?: {
    link: string;
    type: "PREF" | "WORK" | "HOME";
  }[];
};

export const avatarShapes = ["circle", "rounded", "square"] as const;
export type AvatarShape = (typeof avatarShapes)[number];

export const cardShippingStatusTypes = [
  "awaiting_purchase",
  "in_progress",
  "shipped",
  "failed",
] as const;

export const onboardingStepTypes = [
  "start",
  "contact",
  "portal",
  "nfc-card",
  "purchase",
  "finale",
] as const;
export type OnboardingStep = (typeof onboardingStepTypes)[number];

export type CardShippingStatus = (typeof cardShippingStatusTypes)[number];

export const users = sqliteTable("user", {
  id: text("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => `usr_${createId()}`),
  username: text("user_name", { length: 255 }).unique(),
  name: text("name", { length: 255 }),
  email: text("email", { length: 255 }).notNull(),
  emailVerified: int("email_verified", {
    mode: "timestamp",
  }).default(sql`(unixepoch())`),
  image: text("image", { length: 255 }),
  bio: text("bio"),
  profileHeader: text("profile_header"),
  hasPageActive: int("page_active", { mode: "boolean" }).default(true),
  pageLayout: text("page_layout", { enum: pageLayoutTypes }).default("basic"),
  contactVCard: text("contact_v_card"),
  contactJSON: text("contact_json", { mode: "json" }).$type<ContactVCardType>(),
  hasContactInfoLocked: int("is_contact_info_locked", {
    mode: "boolean",
  }).default(false),
  hasPurchasedCard: int("has_purchased_card", { mode: "boolean" }).default(false),
  hasCompletedOnboarding: int("has_completed_onboarding", { mode: "boolean" }).default(false),
  onboardingStep: text("onboarding_step", { enum: onboardingStepTypes }).default("contact"),
  pageHashKey: text("page_hash_key"),
  metaTitle: text("meta_title", { length: 255 }),
  metaDescription: text("meta_description"),
  metaImage: text("meta_image"),
  cardShippingStatus: text("card_shipping_status", { enum: cardShippingStatusTypes }).default(
    "awaiting_purchase",
  ),
  cardVariant: text("card_variant", { enum: cardVariants }).notNull().default("basic"),
  avatarShape: text("avatar_shape", { enum: avatarShapes }).notNull().default("rounded"),
  theme: text("theme", { mode: "json" }).notNull().$type<ThemeType>().default(BASE_THEMES.default),
});

export const userProfileSchema = createInsertSchema(users, {
  theme: z.custom<ThemeType>(),
  contactJSON: z.custom<ContactVCardType>(),
});

export const editVisualCustomizationSchema = createInsertSchema(users, {
  theme: themeSchema.and(z.custom<ThemeType>()),
  bio: z.string().optional(),
  profileHeader: z.string().optional(),
  pageLayout: z.enum(["basic", "grid", "hero"]),
}).pick({ theme: true, bio: true, profileHeader: true, pageLayout: true, avatarShape: true });

export type EditVisualCustomizationSchema = z.infer<typeof editVisualCustomizationSchema>;

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  links: many(links),
  enterprisesThrough: many(usersToEnterprises),
  purchases: many(purchases),
}));

export const purchases = sqliteTable("purchases", {
  id: text("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => `pay_${createId()}`),
  paymentId: int("payment_id", { mode: "number" }).unique(),
  currency: text("currency", { length: 255 }).notNull(),
  userId: text("user_id", { length: 255 }),
  amount: int("amount", { mode: "number" }).notNull(),
  metadata: text("metadata", { mode: "json" })
    .$type<
      SaveNFCPreferences & { app_user_id: string; shipping_address: string; [x: string]: unknown }
    >()
    .notNull(),
  status: text("status", { length: 255 }).notNull().default("pending"),
  createdAt: int("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: int("updated_at", { mode: "timestamp" }).$onUpdate(() => new Date()),
});

export const purchasesRelations = relations(purchases, ({ one }) => ({
  user: one(users, { fields: [purchases.userId], references: [users.id] }),
}));

export const enterprises = sqliteTable("enterprises", {
  id: text("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => `ent_${createId()}`),
  name: text("name", { length: 255 }).notNull(),
  domain: text("domain", { length: 255 }),
  logo: text("logo", { length: 255 }),
  description: text("description"),
  createdAt: int("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: int("updated_at", { mode: "timestamp" }).$onUpdate(() => new Date()),
});

export const enterpriseRoleTypes = ["admin", "user"] as const;
export type EnterpriseRole = (typeof enterpriseRoleTypes)[number];

export const enterpriseUserStatusTypes = ["active", "suspended"] as const;
export type EnterpriseUserStatus = (typeof enterpriseUserStatusTypes)[number];

export const enterprisesRelations = relations(enterprises, ({ many, one }) => ({
  usersThrough: many(usersToEnterprises),
  subscription: one(subscriptions, {
    fields: [enterprises.id],
    references: [subscriptions.enterpriseId],
  }),
}));

export const usersToEnterprises = sqliteTable("users_to_enterprises", {
  userId: text("user_id", { length: 255 })
    .notNull()
    .references(() => users.id),
  enterpriseId: text("enterprise_id", { length: 255 })
    .notNull()
    .references(() => enterprises.id),
  role: text("role", { length: 255, enum: enterpriseRoleTypes }).notNull().default("user"),
  status: text("status", { length: 255, enum: enterpriseUserStatusTypes })
    .notNull()
    .default("active"),
});

export const usersToEnterprisesRelations = relations(usersToEnterprises, ({ one }) => ({
  user: one(users, { fields: [usersToEnterprises.userId], references: [users.id] }),
  enterprise: one(enterprises, {
    fields: [usersToEnterprises.enterpriseId],
    references: [enterprises.id],
  }),
}));

const subscriptionStatusTypes = [
  "active",
  "on_trial",
  "paused",
  "past_due",
  "unpaid",
  "cancelled",
  "expired",
] as const;
export type SubscriptionStatus = (typeof subscriptionStatusTypes)[number];

export const subscriptionPlans = [
  "basic_monthly",
  "basic_annual",
  "pro_monthly",
  "pro_annual",
] as const;
export type SubscriptionPlan = (typeof subscriptionPlans)[number];

export const subscriptions = sqliteTable("subscription", {
  id: text("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => `sub_${createId()}`),
  enterpriseId: text("enterprise_id", { length: 255 })
    .notNull()
    .references(() => enterprises.id),
  planId: text("plan_id", { length: 255, enum: subscriptionPlans })
    .notNull()
    .default("basic_annual"),
  status: text("status", { length: 255, enum: subscriptionStatusTypes })
    .notNull()
    .default("active"),
  expiresAt: int("expires_at", { mode: "timestamp" }),
  canceledAt: int("canceled_at", { mode: "timestamp" }),
  updatedAt: int("updated_at", { mode: "timestamp" }).$onUpdate(() => new Date()),
  createdAt: int("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
});

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  enterprise: one(enterprises, {
    fields: [subscriptions.enterpriseId],
    references: [enterprises.id],
  }),
}));

export const accounts = sqliteTable(
  "account",
  {
    userId: text("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    type: text("type", { length: 255 }).$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider", { length: 255 }).notNull(),
    providerAccountId: text("provider_account_id", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: int("expires_at"),
    token_type: text("token_type", { length: 255 }),
    scope: text("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: text("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_user_id_idx").on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = sqliteTable(
  "session",
  {
    sessionToken: text("session_token", { length: 255 }).notNull().primaryKey(),
    userId: text("userId", { length: 255 })
      .notNull()
      .references(() => users.id),
    expires: int("expires", { mode: "timestamp" }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_userId_idx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = sqliteTable(
  "verification_token",
  {
    identifier: text("identifier", { length: 255 }).notNull(),
    token: text("token", { length: 255 }).notNull(),
    expires: int("expires", { mode: "timestamp" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);
