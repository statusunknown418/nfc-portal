import NextAuth, { type DefaultSession } from "next-auth";
import { AuthConfig } from "~/auth.config";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      username: string;
    } & DefaultSession["user"];
  }
}

/**
 * NextAuth v5 configuration
 */
export const { auth, handlers, signIn, signOut } = NextAuth(AuthConfig);
