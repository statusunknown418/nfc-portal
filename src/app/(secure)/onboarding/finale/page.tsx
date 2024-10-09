import { CheckCircledIcon } from "@radix-ui/react-icons";
import { getTranslations } from "next-intl/server";
import { FinaleClientAlert } from "~/components/onboarding/FinaleClientAlert";
import { api, HydrateClient } from "~/trpc/server";

export default async function FinalePage() {
  const t = await getTranslations("admin.onboarding.steps.finale");
  void api.viewer.shouldShowLive.prefetch();

  return (
    <HydrateClient>
      <section className="relative flex flex-col items-center justify-center gap-4">
        <CheckCircledIcon className="h-12 w-12 text-emerald-600 md:h-12 md:w-12" />

        <h2 className="text-2xl font-bold tracking-wide md:text-4xl">{t("title")}</h2>

        <p className="max-w-prose text-center">
          <span>{t("descriptionPart1")}</span>{" "}
          <span className="text-muted-foreground">{t("descriptionPart2")}</span>
        </p>

        <FinaleClientAlert />
      </section>
    </HydrateClient>
  );
}
