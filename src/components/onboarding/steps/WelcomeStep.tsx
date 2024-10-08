import { ArrowRightIcon, ExternalLinkIcon, LightningBoltIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useQueryStates } from "nuqs";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import { onboardingParsers } from "../onboarding.parsers";
import { useTranslations } from "next-intl";

export const WelcomeStep = () => {
  const [_, changeStep] = useQueryStates(onboardingParsers, { history: "push" });

  const { mutate } = api.viewer.setOnboardingStep.useMutation();

  const t = useTranslations("admin.onboarding.steps.welcome");

  const handleClick = async () => {
    void Promise.all([changeStep({ step: "contact" }), mutate({ step: "contact" })]);
  };

  return (
    <section className="relative mx-auto flex h-[calc(100svh-250px)] flex-col items-center justify-center gap-4">
      <LightningBoltIcon className="h-10 w-10 text-indigo-600 md:h-12 md:w-12" />

      <h2 className="text-2xl font-bold tracking-wide md:text-4xl">{t("title")}</h2>

      <p className="max-w-prose text-center">
        <span>{t("message")}</span>

        <br />
        <br />

        <span className="text-muted-foreground">
          {t("helpOne")}{" "}
          <Link
            href={`mailto:support@stackkstudios.com?subject=${encodeURIComponent("ConCard <> Help needed!")}`}
            className="inline-flex items-center gap-1 text-indigo-600 underline underline-offset-1"
          >
            {t("helpTwo")} <ExternalLinkIcon />
          </Link>
        </span>
      </p>

      <Button
        size="lg"
        variant="primary_ghost"
        className="z-10 mt-4 rounded-full"
        onClick={handleClick}
      >
        {t("startButton")} <ArrowRightIcon />
      </Button>
    </section>
  );
};
