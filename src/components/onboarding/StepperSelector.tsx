"use client";

import {
  CheckCircledIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TrackNextIcon,
} from "@radix-ui/react-icons";
import { AnimatePresence } from "framer-motion";
import { type Session } from "next-auth";
import Link from "next/link";
import { useQueryStates } from "nuqs";
import { type ReactNode } from "react";
import { api, type RouterOutputs } from "~/trpc/react";
import { ContactDataForm } from "../admin/contact/contact-data/ContactDataForm";
import { Button } from "../ui/button";
import { ContactStep } from "./steps/ContactStep";
import { NFCPreferencesStep } from "./steps/NFCPreferencesStep";
import { keys, onboardingParsers, type Keys } from "./onboarding.parsers";
import { PublicPortalStep } from "./steps/PublicPortalStep";
import { cn } from "~/lib/utils";
import { WelcomeStep } from "./steps/WelcomeStep";
import { FinaleStep } from "./steps/FinaleStep";
import { PurchaseCardStep } from "./steps/PurchaseCardStep";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

export const StepperSelector = ({
  session,
  initialData,
  components,
}: {
  session: Session;
  initialData: {
    contact: RouterOutputs["vCard"]["get"];
  };
  components?: {
    portal: ReactNode;
    visual: ReactNode;
  };
}) => {
  const [{ step }, changeStep] = useQueryStates(onboardingParsers);
  const { mutate } = api.viewer.setOnboardingStep.useMutation();

  const StepComponents: Record<Keys, ReactNode> = {
    start: <WelcomeStep />,
    contact: (
      <ContactStep>
        <ContactDataForm initialData={initialData.contact} user={session.user} />
      </ContactStep>
    ),
    portal: (
      <PublicPortalStep>
        <div>{components?.visual}</div>
        <div className="pr-4 md:pr-8">{components?.portal}</div>
      </PublicPortalStep>
    ),
    "nfc-card": <NFCPreferencesStep initialData={initialData.contact} />,
    purchase: <PurchaseCardStep />,
    finale: <FinaleStep />,
  };

  const rewindStep = () => {
    if (step === "start") {
      return;
    }

    const newStep = keys[keys.indexOf(step) - 1];

    void mutate({ step: newStep });
    void changeStep({ step: newStep });
  };

  const forwardStep = () => {
    const newStep = keys[keys.indexOf(step) + 1];

    void mutate({ step: newStep });
    void changeStep({ step: newStep });
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
          <h3>Let&apos;s get you set up, {session.user.username}</h3>

          <div className="relative mt-4 h-full max-h-[calc(100%-80px)]">
            {step && StepComponents[step]}
          </div>
        </section>

        <section className="absolute bottom-0 left-0 flex h-max w-full items-center justify-between gap-4 border-t bg-muted px-8 py-4">
          {step !== "start" && (
            <Button variant="outline" onClick={rewindStep}>
              <ChevronLeftIcon /> Previous step
            </Button>
          )}

          <div className="ml-auto flex gap-4">
            {step !== "finale" && step !== "start" && (
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" onClick={forwardStep}>
                      Skip step <TrackNextIcon />
                    </Button>
                  </TooltipTrigger>

                  <TooltipContent>
                    This is not recommended, you may loose access to cool features
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            {step === "finale" ? (
              <Button asChild>
                <Link href="/admin">
                  Complete onboarding <CheckCircledIcon />
                </Link>
              </Button>
            ) : (
              <Button onClick={forwardStep}>
                Next step
                <ChevronRightIcon />
              </Button>
            )}
          </div>
        </section>
      </section>
    </AnimatePresence>
  );
};
