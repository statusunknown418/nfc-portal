"use client";

import { useTranslations } from "next-intl";
import { api } from "~/trpc/react";
import { Button } from "../ui/button";
import { onboardingKeys, type OnboardingKeys } from "./onboarding.parsers";
import { useSelectedLayoutSegment } from "next/navigation";
import Link from "next/link";
import { ArrowRightIcon, ChevronLeftIcon } from "@radix-ui/react-icons";

export const ForwardRewindButtons = () => {
  const selectedSegment = useSelectedLayoutSegment() as OnboardingKeys;
  const utils = api.useUtils();
  const { mutate } = api.viewer.setOnboardingStep.useMutation();

  const t = useTranslations("admin.onboarding");

  const getPrev = (): OnboardingKeys => {
    if (selectedSegment === "start") {
      return "start";
    }

    return onboardingKeys[onboardingKeys.indexOf(selectedSegment) - 1]!;
  };

  const getNext = (): OnboardingKeys => {
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
    <footer className="mx-auto flex w-full max-w-3xl items-center justify-between rounded-3xl border bg-white p-4">
      <Button asChild onClick={handleRewind} variant="ghost">
        <Link href={`/onboarding/${getPrev()}`}>
          <ChevronLeftIcon />
          {t("previousButton")}
        </Link>
      </Button>

      <Button asChild onClick={handleForward} variant="primary_ghost">
        <Link href={`/onboarding/${getNext()}`}>
          {t("nextButton")}
          <ArrowRightIcon />
        </Link>
      </Button>
    </footer>
  );
};
