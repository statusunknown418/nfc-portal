"use client";

import {
  EnterIcon,
  IdCardIcon,
  LightningBoltIcon,
  PersonIcon,
  RulerHorizontalIcon,
} from "@radix-ui/react-icons";
import { ShoppingBagIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSelectedLayoutSegment } from "next/navigation";
import { cn } from "~/lib/utils";
import { type OnboardingKeys } from "./onboarding.parsers";
import { Divider } from "../ui/separator";

export const Stepper = () => {
  const step = useSelectedLayoutSegment() as OnboardingKeys;
  const t = useTranslations("admin.onboarding.stepper");

  const stepsItems: {
    key: OnboardingKeys;
    Selector: React.FC<{ className?: string }>;
    RenderIcon: React.FC<{ className?: string }>;
  }[] = [
    {
      key: "start",
      Selector: ({ className }) => (
        <h2 className={cn("font-medium", className)}>{t("welcome.title")}</h2>
      ),
      RenderIcon: ({ className }) => (
        <section className={cn("py-2", className)}>
          <EnterIcon className="size-5 md:size-7" />
        </section>
      ),
    },
    {
      key: "contact",
      Selector: ({ className }) => (
        <h2 className={cn("font-medium", className)}>{t("contact.title")}</h2>
      ),
      RenderIcon: ({ className }) => (
        <section className={cn("py-2", className)}>
          <PersonIcon className="size-5 md:size-7" />
        </section>
      ),
    },
    {
      key: "portal",
      Selector: ({ className }) => (
        <h2 className={cn("font-medium", className)}>{t("portal.title")}</h2>
      ),
      RenderIcon: ({ className }) => (
        <section className={cn("py-2", className)}>
          <RulerHorizontalIcon className="size-5 md:size-7" />
        </section>
      ),
    },
    {
      key: "nfc-card",
      Selector: ({ className }) => (
        <h2 className={cn("font-medium", className)}>{t("nfc-card.title")}</h2>
      ),
      RenderIcon: ({ className }) => (
        <section className={cn("py-2", className)}>
          <IdCardIcon className="size-5 md:size-7" />
        </section>
      ),
    },
    {
      key: "purchase",
      Selector: ({ className }) => (
        <h2 className={cn("font-medium", className)}>{t("purchase.title")}</h2>
      ),
      RenderIcon: ({ className }) => (
        <section className={cn("py-2", className)}>
          <ShoppingBagIcon className="size-5 md:size-7" />
        </section>
      ),
    },
    {
      key: "finale",
      Selector: ({ className }) => (
        <h2 className={cn("font-medium", className)}>{t("finale.title")}</h2>
      ),
      RenderIcon: ({ className }) => (
        <section className={cn("py-2", className)}>
          <LightningBoltIcon className="size-5 md:size-7" />
        </section>
      ),
    },
  ];

  return (
    <ul className="mx-auto grid w-full max-w-4xl grid-cols-6 justify-center gap-1 px-4 md:px-0">
      {stepsItems.map(({ key, RenderIcon, Selector }, idx) => (
        <li
          key={key}
          className={cn(
            "flex w-full flex-col items-center gap-2 opacity-35",
            step === key && "opacity-100",
            stepsItems.findIndex((i) => i.key === step) > idx && "opacity-90",
          )}
        >
          <div
            className={cn(
              "flex aspect-square w-16 flex-col items-center justify-center gap-1 rounded-full border",
              step !== key && "bg-muted",
              step === key && "border-indigo-500 bg-indigo-50",
              stepsItems.findIndex((i) => i.key === step) > idx && "border-border/50 bg-white",
            )}
          >
            <RenderIcon className={cn(step === key && "text-indigo-600")} />
          </div>

          <Selector className={cn("text-center", step === key && "text-indigo-600")} />
        </li>
      ))}
    </ul>
  );
};
