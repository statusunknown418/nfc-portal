import type en from "~/lib/messages/en.json";
import { type formats } from "~/i18n/request";

export {};

type Formats = typeof formats;
type Messages = typeof en;

declare global {
  interface CustomJwtSessionClaims {
    firstName?: string;
    lastName?: string;
    image?: string;
    username: string;
    userId: string;
    email: string;
  }

  type IntlMessages = Messages;
  type IntlFormats = Formats;
}
