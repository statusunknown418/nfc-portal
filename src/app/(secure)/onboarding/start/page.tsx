"use client";

import { ArrowRightIcon, ExternalLinkIcon, LightningBoltIcon } from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

export default function StartPage() {
  const t = useTranslations("admin.onboarding.steps.welcome");

  const utils = api.useUtils();
  const { mutate } = api.viewer.setOnboardingStep.useMutation();
  const router = useRouter();

  const handleClick = () => {
    void Promise.all([
      mutate({ step: "contact" }),
      utils.viewer.shouldShowLive.invalidate(),
      router.push("/onboarding/contact"),
    ]);
  };

  return (
    <section className="relative mx-auto flex flex-grow flex-col items-center justify-center gap-4">
      <LightningBoltIcon className="h-10 w-10 text-indigo-600 md:h-12 md:w-12" />

      <h2 className="text-2xl font-bold tracking-tight md:text-4xl">{t("title")}</h2>

      <p className="max-w-prose text-center">
        <span>{t("message")}</span>

        <br />
        <br />

        <span className="text-muted-foreground">
          {t("helpOne")}{" "}
          <Link
            href={`mailto:support@stackkstudios.com?subject=${encodeURIComponent("ConCard > Help needed!")}`}
            className="inline-flex items-center gap-1 text-indigo-600 underline underline-offset-1"
          >
            {t("helpTwo")} <ExternalLinkIcon />
          </Link>
        </span>
      </p>

      <Button
        asChild
        size="lg"
        variant="primary_ghost"
        className="z-10 mt-4 rounded-full"
        onClick={handleClick}
      >
        <Link href="/onboarding/contact">
          {t("startButton")} <ArrowRightIcon />
        </Link>
      </Button>
    </section>
  );
}
