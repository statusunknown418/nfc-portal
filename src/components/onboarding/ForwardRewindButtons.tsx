"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { onboardingKeys, type OnboardingStep } from "~/server/db/schema";
import { api } from "~/trpc/react";
import { Button } from "../ui/button";

export const ForwardRewindButtons = () => {
  const selectedSegment = useSelectedLayoutSegment() as OnboardingStep;
  const utils = api.useUtils();
  const { mutate } = api.viewer.setOnboardingStep.useMutation();

  const t = useTranslations("admin.onboarding");

  const getPrev = (): OnboardingStep => {
    if (selectedSegment === "start") {
      return "start";
    }

    return onboardingKeys[onboardingKeys.indexOf(selectedSegment) - 1]!;
  };

  const getNext = (): OnboardingStep => {
    if (selectedSegment === "finale") {
      return "finale";
    }

    return onboardingKeys[onboardingKeys.indexOf(selectedSegment) + 1]!;
  };

  const handleForward = () => {
    const next = getNext();

    void Promise.all([
      mutate({ step: next, forceCompleted: next === "finale" }),
      utils.viewer.shouldShowLive.invalidate(),
    ]);
  };

  const handleRewind = () => {
    const prev = getPrev();

    void Promise.all([mutate({ step: prev }), utils.viewer.shouldShowLive.invalidate()]);
  };

  if (selectedSegment === "finale" || selectedSegment === "start") {
    return;
  }

  return (
    <footer className="fixed bottom-4 z-20 mx-auto flex w-full max-w-3xl items-center justify-between rounded-full border bg-white/60 p-4 backdrop-blur backdrop-filter">
      <Button asChild onClick={handleRewind} variant="ghost">
        <Link href={`/onboarding/${getPrev()}`}>
          <ChevronLeftIcon />
          {t("previousButton")}
        </Link>
      </Button>

      <Button asChild onClick={handleForward} variant="iOSGhost" className="text-indigo-600">
        <Link href={`/onboarding/${getNext()}`}>
          {t("nextButton")}
          <ChevronRightIcon />
        </Link>
      </Button>
    </footer>
  );
};
