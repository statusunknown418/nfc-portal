import { createId } from "@paralleldrive/cuid2";
import { relations, sql } from "drizzle-orm";
import { index, int, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { type AdapterAccount } from "next-auth/adapters";
import { z } from "zod";

export const linkTypes = ["social", "deployable", "basic"] as const;
export type LinkType = (typeof linkTypes)[number];
export const linkLayoutTypes = ["basic", "featured"] as const;
export type LinkLayoutType = (typeof linkLayoutTypes)[number];

export const pageLayoutTypes = ["basic", "grid", "hero"] as const;
export type PageLayoutType = (typeof pageLayoutTypes)[number];

export type ThemeType = {
  colorScheme: "light" | "dark";
  foregroundColor: string;
  background: {
    type: "flat" | "pattern";
    background: string;
  };
  buttons: {
    type: "solid" | "outline" | "ghost" | "link";
    variant: "pill" | "rounded" | "square";
    textColor: string;
    background: string;
    border?: string;
  };
};

export const DEFAULT_THEME: ThemeType = {
  colorScheme: "light",
  foregroundColor: "#FFFFFF",
  background: {
    type: "flat",
    background: "#000222",
  },
  buttons: {
    type: "solid",
    variant: "pill",
    textColor: "#FFFFFF",
    background: "#007AFF",
  },
};

export const links = sqliteTable("links", {
  id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  displayText: text("display_text"),
  description: text("description"),
  buttonLabel: text("button_label"),
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
  userId: z.undefined(),
});

export type NewLinkSchema = z.infer<typeof newLinkSchema>;

export const linksRelations = relations(links, ({ one }) => ({
  user: one(users, { fields: [links.userId], references: [users.id] }),
}));

export type ContactVCardType = {
  url?: string;
  jobTitle?: string;
  notes: string;
  company?: {
    name: string;
    department?: string;
  };
  social?: {
    link: string;
    type: "TWITTER" | "FACEBOOK" | "INSTAGRAM" | "LINKEDIN" | "GITHUB" | "YOUTUBE";
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
  hasPageActive: int("page_active", { mode: "boolean" }).default(true),
  pageLayout: text("page_layout", { enum: pageLayoutTypes }).default("basic"),
  contactVCard: text("contact_v_card"),
  contactJSON: text("contact_json", { mode: "json" }).$type<ContactVCardType>(),
  hasContactInfoLocked: int("is_contact_info_locked", {
    mode: "boolean",
  }).default(true),
  pageHashKey: text("page_hash_key"),
  metaTitle: text("meta_title", { length: 255 }),
  metaDescription: text("meta_description"),
  metaImage: text("meta_image"),
  theme: text("theme", { mode: "json" }).notNull().$type<ThemeType>().default(DEFAULT_THEME),
});

export const userProfileSchema = createInsertSchema(users, {
  theme: z.custom<ThemeType>(),
  contactJSON: z.custom<ContactVCardType>(),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  links: many(links),
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
