"use client";

import { AnimatePresence } from "framer-motion";
import { type Session } from "next-auth";
import { useQueryStates } from "nuqs";
import { type ReactNode } from "react";
import { type RouterOutputs } from "~/trpc/react";
import { ContactDataForm } from "../admin/contact/contact-data/ContactDataForm";
import { Button } from "../ui/button";
import { keys, onboardingParsers, type Keys } from "./onboarding.parsers";

import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { ContactStep } from "./ContactStep";
import { PublicPortalStep } from "./PublicPortalStep";
import { NFCPreferencesStep } from "./NFCPreferencesStep";

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

  const StepComponents: Record<Keys, ReactNode> = {
    contact: (
      <ContactStep>
        <ContactDataForm initialData={initialData.contact} user={session.user} />
      </ContactStep>
    ),
    portal: (
      <PublicPortalStep>
        <div className="max-h-max">{components?.visual}</div>
        <div>{components?.portal}</div>
      </PublicPortalStep>
    ),
    "nfc-card": <NFCPreferencesStep initialData={initialData.contact} />,
    purchase: <div></div>,
    finale: <div></div>,
  };

  const goPrevious = () => {
    if (step === "contact") {
      return;
    }

    const newStep = keys[keys.indexOf(step) - 1];

    void changeStep({ step: newStep });
  };

  const goNext = () => {
    const newStep = keys[keys.indexOf(step) + 1];

    void changeStep({ step: newStep });
  };

  return (
    <AnimatePresence>
      <section className="relative flex h-full flex-col">
        <section className="flex-grow overflow-auto p-4 md:p-8 md:pb-12">
          <h3 className="mb-6">Let&apos;s get you set up, {session.user.username}</h3>

          {step && StepComponents[step]}
        </section>

        <div className="absolute bottom-0 left-0 flex h-max w-full items-center justify-between gap-4 border-t bg-muted px-8 py-4">
          {step !== "contact" && (
            <Button variant="outline" onClick={goPrevious}>
              <ChevronLeftIcon /> Previous step
            </Button>
          )}

          <Button className="ml-auto" onClick={goNext}>
            Next step
            <ChevronRightIcon />
          </Button>
        </div>
      </section>
    </AnimatePresence>
  );
};
