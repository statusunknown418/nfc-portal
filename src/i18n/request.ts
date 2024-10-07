import { type AbstractIntlMessages, type Formats } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";
import { LOCALE_KEY } from "~/middleware";
import { defaultLocale, type Locale } from "./config";

export const formats = {
  list: {
    enumeration: {
      style: "long",
    },
  },
} satisfies Formats;

const messageImports = {
  en: () => import("./messages/en.json"),
  es: () => import("./messages/es.json"),
} as const satisfies Record<Locale, () => Promise<{ default: AbstractIntlMessages }>>;

export default getRequestConfig(async () => {
  const locale = (cookies().get(LOCALE_KEY)?.value as Locale) || defaultLocale;
  const messages = (await messageImports[locale]()).default;

  return {
    locale,
    formats,
    messages,
  };
});
