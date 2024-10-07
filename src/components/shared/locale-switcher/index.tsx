import { getLocale } from "next-intl/server";
import { type Locale } from "~/i18n/config";
import { LocaleSwitcher } from "./LocaleSwitcher";

export const LocaleSwitcherWrapper = async () => {
  const locale = (await getLocale()) as Locale;

  return <LocaleSwitcher initial={locale} />;
};
