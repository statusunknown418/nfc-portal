import { getLocale } from "next-intl/server";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { type Locale } from "~/i18n/config";
import { cookies } from "next/headers";
import { LOCALE_KEY } from "~/middleware";

export const LocaleSwitcherWrapper = async () => {
  const locale = (await getLocale()) as Locale;

  const changeLocale = async () => {
    "use server";
    void cookies().set(LOCALE_KEY, locale);
  };

  return <LocaleSwitcher initial={locale} setSpanish={changeLocale} setEnglish={changeLocale} />;
};
