import { type Formats } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";
import { defaultLocale, type Locale } from "./config";
import { LOCALE_KEY } from "~/middleware";

export const formats = {
  list: {
    enumeration: {
      style: "long",
    },
  },
} satisfies Formats;

export default getRequestConfig(async () => {
  const locale = (cookies().get(LOCALE_KEY)?.value as Locale) || defaultLocale;

  return {
    locale,
    formats,
    // TODO: Make this work without eslint-ignore and ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    messages: (await import(`../lib/messages/${locale}.json`)).default,
  };
});
