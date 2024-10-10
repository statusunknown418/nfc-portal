import { type AbstractIntlMessages, type Formats } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { locales, type Locale } from "./config";
import { cookies } from "next/headers";
import { LOCALE_KEY } from "~/lib/utils";

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
  const locale = cookies().get(LOCALE_KEY)?.value as Locale;

  if (!locales.some((l) => l === locale)) {
    return {
      locale: "es",
      formats,
      messages: (await messageImports.es()).default,
    };
  }

  const messages = (await messageImports[locale]()).default;

  return {
    locale,
    formats,
    messages,
  };
});
