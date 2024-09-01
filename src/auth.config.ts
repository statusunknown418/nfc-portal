import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { createId } from "@paralleldrive/cuid2";
import { type NextAuthConfig } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import GoogleProvider from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import { env } from "./env";
import { db } from "./server/db";
import { accounts, sessions, users, verificationTokens } from "./server/db/schema";
import { cookies } from "next/headers";

export const AuthConfig = {
  adapter: DrizzleAdapter(db, {
    // @ts-expect-error what the hell
    usersTable: users,
    // @ts-expect-error what the hell
    accountsTable: accounts,
    // @ts-expect-error what the hell
    sessionsTable: sessions,
    // @ts-expect-error what the hell
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
        // @ts-expect-error weird TS bug
        token.username = user.username;
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
          username: token.username ?? session.user.username,
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

      const cookieUsername = cookies().get("decided-username");
      const pageHashKey = createId();
      const username = cookieUsername?.value ?? user.email?.split("@")[0] + "_" + pageHashKey;
      const name = user.email?.split("@")[0];
      const image = user.image ?? `https://api.dicebear.com/7.x/initials/svg?seed=${username}`;

      await db
        .insert(users)
        .values({ id: user.id, image, name, email: user.email, pageHashKey, username })
        .onConflictDoUpdate({
          set: {
            image,
            name,
            pageHashKey,
            username,
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
