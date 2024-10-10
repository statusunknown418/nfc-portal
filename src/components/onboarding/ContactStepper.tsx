"use client";

import { useQueryStates } from "nuqs";
import { contactStepParsers, type ContactSteps } from "./contactStep.parsers";
import { PersonalInfoForm } from "./PersonalInfo";
import { type RouterOutputs } from "~/trpc/react";
import { HowToContact } from "./HowToContact";
import { WorkInfo } from "./WorkInfo";

export const ContactStepper = ({
  initialData,
  user,
}: {
  initialData: RouterOutputs["vCard"]["get"];
  user: CustomJwtSessionClaims;
}) => {
  const [{ step }] = useQueryStates(contactStepParsers);

  const stepsItems: Record<ContactSteps, React.ReactNode> = {
    personal: <PersonalInfoForm initialData={initialData} />,
    work: <HowToContact initialData={initialData} user={user} />,
    addresses: <WorkInfo initialData={initialData} />,
  };

  return stepsItems[step];
};
