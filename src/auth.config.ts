import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { type NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import DiscordProvider from "next-auth/providers/discord";
import { db } from "./server/db";
import { createId } from "@paralleldrive/cuid2";
import { accounts, sessions, users, verificationTokens } from "./server/db/schema";
import Resend from "next-auth/providers/resend";
import { eq } from "drizzle-orm";
import { env } from "./env";

export const AuthConfig = {
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  pages: {
    signIn: "/auth/login",
    verifyRequest: "/auth/verify",
  },
  callbacks: {
    jwt: async ({ token, user, account }) => {
      if (account) {
        token.id = account.userId;
      }

      if (user) {
        token.id = user.id;
      }

      return token;
    },
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.id as string,
      },
    }),
  },
  session: {
    strategy: "jwt",
  },
  events: {
    updateUser: async ({ user }) => {
      if (!user.id) {
        return;
      }

      const name = user.name ?? user.email?.split("@")[0];
      const image = user.image ?? `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`;

      await db.update(users).set({ image, name }).where(eq(users.id, user.id));
    },
  },
  debug: env.NODE_ENV === "development",
  providers: [
    GoogleProvider,
    DiscordProvider,
    Resend({
      from: "no-reply@chronosecrets.app",
      generateVerificationToken: async () => {
        return `nfc_${createId()}`;
      },
    }),
  ],
} satisfies NextAuthConfig;
