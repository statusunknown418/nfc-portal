"use client";

import { CheckCircledIcon, ChevronLeftIcon, TrackNextIcon } from "@radix-ui/react-icons";
import { AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useQueryStates } from "nuqs";
import { type ReactNode } from "react";
import { cn } from "~/lib/utils";
import { api, type RouterOutputs } from "~/trpc/react";
import { ContactDataForm } from "../admin/contact/contact-data/ContactDataForm";
import { Button } from "../ui/button";
import { keys, onboardingParsers, type Keys } from "./onboarding.parsers";
import { ContactStep } from "./steps/ContactStep";
import { FinaleStep } from "./steps/FinaleStep";
import { NFCPreferencesStep } from "./steps/NFCPreferencesStep";
import { PublicPortalStep } from "./steps/PublicPortalStep";
import { PurchaseCardStep } from "./steps/PurchaseCardStep";
import { WelcomeStep } from "./steps/WelcomeStep";

export const StepperSelector = ({
  session,
  initialData,
  components,
}: {
  session: CustomJwtSessionClaims;
  initialData: {
    contact: RouterOutputs["vCard"]["get"];
    shareLink: RouterOutputs["viewer"]["shouldShowLive"];
  };
  components?: {
    portal: ReactNode;
    visual: ReactNode;
  };
}) => {
  const [{ step }, changeStep] = useQueryStates(onboardingParsers);
  const { mutate } = api.viewer.setOnboardingStep.useMutation();
  const utils = api.useUtils();

  const StepComponents: Record<Keys, ReactNode> = {
    start: <WelcomeStep />,
    contact: (
      <ContactStep>
        <ContactDataForm initialData={initialData.contact} user={session} />
      </ContactStep>
    ),
    portal: (
      <PublicPortalStep>
        <div>{components?.visual}</div>
        <div className="pr-4 md:pr-8">{components?.portal}</div>
      </PublicPortalStep>
    ),
    "nfc-card": <NFCPreferencesStep initialData={initialData.contact} />,
    purchase: <PurchaseCardStep initialData={initialData.contact} />,
    finale: <FinaleStep initialData={initialData.shareLink} />,
  };

  const rewindStep = () => {
    if (step === "start") {
      return;
    }

    const newStep = keys[keys.indexOf(step) - 1];

    void Promise.all([
      mutate({ step: newStep }),
      changeStep({ step: newStep }),
      utils.viewer.shouldShowLive.invalidate(),
    ]);
  };

  const forwardStep = () => {
    const newStep = keys[keys.indexOf(step) + 1];

    void Promise.all([
      mutate({ step: newStep, forceCompleted: newStep === "finale" }),
      changeStep({ step: newStep }),
      utils.viewer.shouldShowLive.invalidate(),
    ]);
  };

  return (
    <AnimatePresence>
      <section className="relative h-full">
        <section
          className={cn(
            "h-full overflow-auto pl-4 pt-4 md:pl-8 md:pt-8",
            step !== "portal" && "pr-4 md:pr-8",
          )}
        >
          <h3>Let&apos;s get you set up, {session.username}</h3>

          <div className={cn("relative mt-4", step === "nfc-card" && "pb-32")}>
            {step && StepComponents[step]}
          </div>
        </section>

        <section className="absolute bottom-0 left-0 z-10 flex h-max w-full items-center justify-between gap-4 border-t bg-muted px-8 py-4">
          {step !== "start" && (
            <Button variant="outline" onClick={rewindStep}>
              <ChevronLeftIcon /> Previous step
            </Button>
          )}

          <div className="ml-auto flex gap-4">
            {step === "finale" ? (
              <Button asChild>
                <Link href="/admin">
                  Complete onboarding <CheckCircledIcon />
                </Link>
              </Button>
            ) : (
              <Button onClick={forwardStep}>
                Next step
                <TrackNextIcon />
              </Button>
            )}
          </div>
        </section>
      </section>
    </AnimatePresence>
  );
};
