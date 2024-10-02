import { ArrowRightIcon, ExternalLinkIcon, LightningBoltIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useQueryStates } from "nuqs";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import { onboardingParsers } from "../onboarding.parsers";

export const WelcomeStep = () => {
  const [_, changeStep] = useQueryStates(onboardingParsers, { history: "push" });

  const { mutate } = api.viewer.setOnboardingStep.useMutation();

  const handleClick = async () => {
    void Promise.all([changeStep({ step: "contact" }), mutate({ step: "contact" })]);
  };

  return (
    <section className="relative mx-auto flex h-[calc(100svh-250px)] flex-col items-center justify-center gap-4">
      <LightningBoltIcon className="h-10 w-10 text-indigo-600 md:h-12 md:w-12" />

      <h2 className="text-2xl font-bold tracking-wide md:text-4xl">Welcome to ConCard!</h2>

      <p className="max-w-prose text-center">
        <span>
          We are excited to have you on board. Before we get started (and to make everything
          smoother), you just need to follow these simple steps to get your account set up.
        </span>

        <br />
        <br />

        <span className="text-muted-foreground">
          If there&apos;s anything you need help with, don&apos;t hesitate to reach out to us.
          We&apos;re here to help!{" "}
          <Link
            href={`mailto:support@stackkstudios.com?subject=${encodeURIComponent("ConCard <> Help needed!")}`}
            className="inline-flex items-center gap-1 text-indigo-600 underline underline-offset-1"
          >
            Contact us here <ExternalLinkIcon />
          </Link>
        </span>
      </p>

      <Button
        size="lg"
        variant="primary_ghost"
        className="z-10 mt-4 rounded-full"
        onClick={handleClick}
      >
        Start onboarding <ArrowRightIcon />
      </Button>
    </section>
  );
};
