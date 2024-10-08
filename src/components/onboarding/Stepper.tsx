"use client";

import {
  EnterIcon,
  IdCardIcon,
  LightningBoltIcon,
  PersonIcon,
  RulerHorizontalIcon,
} from "@radix-ui/react-icons";
import { ShoppingBagIcon } from "lucide-react";
import { useQueryStates } from "nuqs";
import { cn } from "~/lib/utils";
import { type Keys, onboardingParsers } from "./onboarding.parsers";
import { useTranslations } from "next-intl";

export const Stepper = () => {
  const [{ step }] = useQueryStates(onboardingParsers, { history: "push" });
  const t = useTranslations("admin.onboarding.stepper");

  const stepsItems: {
    key: Keys;
    Selector: React.FC<{ className?: string }>;
    RenderIcon: React.FC<{ className?: string }>;
  }[] = [
    {
      key: "start",
      Selector: ({ className }) => (
        <section
          className={cn(
            "inline-flex max-h-24 cursor-default gap-4 rounded-lg border border-transparent px-2 py-2 md:px-4",
            className,
          )}
        >
          <div className="space-y-1 text-left">
            <h2 className="font-medium">{t("welcome.title")}</h2>
            <p className="text-balance text-sm text-muted-foreground">{t("welcome.description")}</p>
          </div>
        </section>
      ),
      RenderIcon: ({ className }) => (
        <section className={cn("py-2", className)}>
          <EnterIcon className="h-4 w-4 md:h-6 md:w-6" />
        </section>
      ),
    },
    {
      key: "contact",
      Selector: ({ className }) => (
        <section
          className={cn(
            "inline-flex max-h-24 cursor-default gap-4 rounded-lg border border-transparent px-2 py-2 md:px-4",
            className,
          )}
        >
          <div className="space-y-1 text-left">
            <h2 className="font-medium">{t("contact.title")}</h2>
            <p className="text-balance text-sm text-muted-foreground">{t("contact.description")}</p>
          </div>
        </section>
      ),
      RenderIcon: ({ className }) => (
        <section className={cn("py-2", className)}>
          <PersonIcon className="h-4 w-4 md:h-6 md:w-6" />
        </section>
      ),
    },
    {
      key: "portal",
      Selector: ({ className }) => (
        <section
          className={cn(
            "inline-flex max-h-24 cursor-default gap-4 rounded-lg border border-transparent px-2 py-2 md:px-4",
            className,
          )}
        >
          <div className="space-y-1 text-left">
            <h2 className="font-medium">{t("portal.title")}</h2>
            <p className="text-wrap text-sm text-muted-foreground">{t("portal.description")}</p>
          </div>
        </section>
      ),
      RenderIcon: ({ className }) => (
        <section className={cn("py-2", className)}>
          <RulerHorizontalIcon className="h-4 w-4 md:h-6 md:w-6" />
        </section>
      ),
    },
    {
      key: "nfc-card",
      Selector: ({ className }) => (
        <section
          className={cn(
            "inline-flex max-h-24 cursor-default gap-4 rounded-lg border border-transparent px-2 py-2 md:px-4",
            className,
          )}
        >
          <div className="space-y-1 text-left">
            <h2 className="font-medium">{t("nfc-card.title")}</h2>
            <p className="text-balance text-sm text-muted-foreground">
              {t("nfc-card.description")}
            </p>
          </div>
        </section>
      ),
      RenderIcon: ({ className }) => (
        <section className={cn("py-2", className)}>
          <IdCardIcon className="h-4 w-4 md:h-6 md:w-6" />
        </section>
      ),
    },
    {
      key: "purchase",
      Selector: ({ className }) => (
        <section
          className={cn(
            "inline-flex max-h-24 cursor-default gap-4 rounded-lg border border-transparent px-2 py-2 md:px-4",
            className,
          )}
        >
          <div className="space-y-1 text-left">
            <h2 className="font-medium">{t("purchase.title")}</h2>
            <p className="text-sm text-muted-foreground">{t("purchase.description")}</p>
          </div>
        </section>
      ),
      RenderIcon: ({ className }) => (
        <section className={cn("py-2", className)}>
          <ShoppingBagIcon className="h-4 w-4 md:h-6 md:w-6" />
        </section>
      ),
    },
    {
      key: "finale",
      Selector: ({ className }) => (
        <section
          className={cn(
            "inline-flex max-h-24 cursor-default gap-4 rounded-lg border border-transparent px-2 py-2 md:px-4",
            className,
          )}
        >
          <div className="space-y-1 text-left">
            <h2 className="font-medium">{t("finale.title")}</h2>
            <p className="text-sm text-muted-foreground">{t("finale.description")}</p>
          </div>
        </section>
      ),
      RenderIcon: ({ className }) => (
        <section className={cn("py-2", className)}>
          <LightningBoltIcon className="h-4 w-4 md:h-6 md:w-6" />
        </section>
      ),
    },
  ];

  return (
    <ol className="grid w-auto grid-cols-1 gap-2 *:data-[stepper-separator=true]:-mt-5 md:grid-cols-[32px_1fr]">
      <ul className="flex flex-col items-center gap-4">
        {stepsItems.map(({ key, RenderIcon }, idx) => (
          <li key={key} className="flex flex-col items-center gap-3">
            <RenderIcon
              className={cn(
                step !== key && "opacity-35",
                stepsItems.findIndex((i) => i.key === step) > idx && "text-indigo-600 opacity-100",
              )}
            />

            {key !== "finale" && (
              <div
                className={cn(
                  "h-10 w-px self-center justify-self-center rounded-full",
                  step === key ? "bg-border" : "bg-border/50",
                  stepsItems.findIndex((i) => i.key === step) > idx && "bg-indigo-600 opacity-100",
                )}
              />
            )}
          </li>
        ))}
      </ul>

      <ul className="hidden w-0 flex-col gap-6 lg:flex lg:w-full">
        {stepsItems.map(({ key, Selector }, idx) => (
          <Selector
            key={key}
            className={cn(
              step !== key && "opacity-35",
              step === key && "border-dashed border-border",
              stepsItems.findIndex((i) => i.key === step) > idx && "text-indigo-600 opacity-100",
            )}
          />
        ))}
      </ul>
    </ol>
  );
};
