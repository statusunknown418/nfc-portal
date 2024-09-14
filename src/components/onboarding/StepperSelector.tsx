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
import { PublicPortalStep } from "./PublicPortalStep";

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
  };
}) => {
  const [{ step }, changeStep] = useQueryStates(onboardingParsers);

  const StepComponents: Record<Keys, ReactNode> = {
    contact: (
      <section className="flex flex-col gap-8">
        <header>
          <h3>Let&apos;s get you set up, {session.user.username}</h3>
          <h2 className="mt-2 text-2xl font-semibold tracking-wide">Welcome to ConCard!</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            First thing first, fill in your contact information, this is what every person you give
            your card to will see, additionally it is possible to hide it from your public page if
            needed.
          </p>
        </header>

        <ContactDataForm initialData={initialData.contact} user={session.user} />
      </section>
    ),
    portal: <PublicPortalStep>{components?.portal}</PublicPortalStep>,
    "nfc-card": <div></div>,
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
      <section className="flex-grow">{step && StepComponents[step]}</section>

      <div className="flex w-full items-center justify-between gap-4">
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
    </AnimatePresence>
  );
};
