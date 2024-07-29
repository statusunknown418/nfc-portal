import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { createId } from "@paralleldrive/cuid2";
import { type NextAuthConfig } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import GoogleProvider from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import { env } from "./env";
import { db } from "./server/db";
import { accounts, sessions, users, verificationTokens } from "./server/db/schema";

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
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.picture = user.image;
      }

      return token;
    },
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          image: token.picture ?? session.user.image,
          name: token.name ?? session.user.name,
          id: token.id as string,
        },
      };
    },
  },
  session: {
    strategy: "jwt",
  },
  events: {
    createUser: async ({ user }) => {
      if (!user.email) {
        return;
      }

      const name = user.name ?? user.email?.split("@")[0];
      const image = user.image ?? `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`;

      await db
        .insert(users)
        .values({ id: user.id, image, name, email: user.email })
        .onConflictDoUpdate({
          set: {
            image,
            name,
          },
          target: users.id,
        });
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
