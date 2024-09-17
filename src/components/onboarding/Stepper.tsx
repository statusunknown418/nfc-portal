"use client";

import {
  IdCardIcon,
  LightningBoltIcon,
  PersonIcon,
  RulerHorizontalIcon,
} from "@radix-ui/react-icons";
import { ShoppingBagIcon } from "lucide-react";
import { useQueryStates } from "nuqs";
import { cn } from "~/lib/utils";
import { type Keys, onboardingParsers } from "./onboarding.parsers";

export const Stepper = () => {
  const [{ step }, changeStep] = useQueryStates(onboardingParsers, { history: "push" });

  const stepsItems: {
    key: Keys;
    Selector: React.FC<{ className?: string; onClick: () => void }>;
    RenderIcon: React.FC<{ className?: string; onClick: () => void }>;
  }[] = [
    {
      key: "contact",
      Selector: ({ className, onClick }) => (
        <button
          className={cn(
            "inline-flex max-h-24 gap-4 rounded-lg border border-transparent px-2 py-2 hover:bg-accent md:px-4",
            className,
          )}
          onClick={onClick}
        >
          <div className="space-y-1 text-left">
            <h2 className="font-medium">Contact information</h2>
            <p className="text-balance text-sm text-muted-foreground">
              Fill in your public contact information
            </p>
          </div>
        </button>
      ),
      RenderIcon: ({ className, onClick }) => (
        <button className={cn("py-2", className)} onClick={onClick}>
          <PersonIcon className="h-4 w-4 md:h-6 md:w-6" />
        </button>
      ),
    },
    {
      key: "portal",
      Selector: ({ className, onClick }) => (
        <button
          className={cn(
            "inline-flex max-h-24 gap-4 rounded-lg border border-transparent px-2 py-2 hover:bg-accent md:px-4",
            className,
          )}
          onClick={onClick}
        >
          <div className="space-y-1 text-left">
            <h2 className="font-medium">Public portal</h2>
            <p className="text-wrap text-sm text-muted-foreground">
              Customize your public page or use a template
            </p>
          </div>
        </button>
      ),
      RenderIcon: ({ className, onClick }) => (
        <button className={cn("py-2", className)} onClick={onClick}>
          <RulerHorizontalIcon className="h-4 w-4 md:h-6 md:w-6" />
        </button>
      ),
    },
    {
      key: "nfc-card",
      Selector: ({ className, onClick }) => (
        <button
          className={cn(
            "inline-flex max-h-24 gap-4 rounded-lg border border-transparent px-2 py-2 hover:bg-accent md:px-4",
            className,
          )}
          onClick={onClick}
        >
          <div className="space-y-1 text-left">
            <h2 className="font-medium">NFC card</h2>
            <p className="text-balance text-sm text-muted-foreground">
              Customize your physical card and get it ready
            </p>
          </div>
        </button>
      ),
      RenderIcon: ({ className, onClick }) => (
        <button className={cn("py-2", className)} onClick={onClick}>
          <IdCardIcon className="h-4 w-4 md:h-6 md:w-6" />
        </button>
      ),
    },
    {
      key: "purchase",
      Selector: ({ className, onClick }) => (
        <button
          className={cn(
            "inline-flex max-h-24 gap-4 rounded-lg border border-transparent px-2 py-2 hover:bg-accent md:px-4",
            className,
          )}
          onClick={onClick}
        >
          <div className="space-y-1 text-left">
            <h2 className="font-medium">Purchase your card</h2>
            <p className="text-sm text-muted-foreground">
              Get it with your preferred payment method
            </p>
          </div>
        </button>
      ),
      RenderIcon: ({ className, onClick }) => (
        <button className={cn("py-2", className)} onClick={onClick}>
          <ShoppingBagIcon className="h-4 w-4 md:h-6 md:w-6" />
        </button>
      ),
    },
    {
      key: "finale",
      Selector: ({ className, onClick }) => (
        <button
          className={cn(
            "inline-flex max-h-24 gap-4 rounded-lg border border-transparent px-2 py-2 hover:bg-accent md:px-4",
            className,
          )}
          onClick={onClick}
        >
          <div className="space-y-1 text-left">
            <h2 className="font-medium">Finale</h2>
            <p className="text-sm text-muted-foreground">All done! You&apos;re ready to roll</p>
          </div>
        </button>
      ),
      RenderIcon: ({ className, onClick }) => (
        <button className={cn("py-2", className)} onClick={onClick}>
          <LightningBoltIcon className="h-4 w-4 md:h-6 md:w-6" />
        </button>
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
                step !== key && "opacity-30",
                stepsItems.findIndex((i) => i.key === step) > idx && "text-indigo-600 opacity-100",
              )}
              onClick={() => changeStep({ step: key })}
            />

            {key !== "finale" && (
              <div
                className={cn(
                  "h-10 w-0.5 self-center justify-self-center rounded-full",
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
              step !== key && "opacity-30",
              step === key && "border-dashed border-border",
              stepsItems.findIndex((i) => i.key === step) > idx && "text-indigo-600 opacity-100",
            )}
            onClick={() => changeStep({ step: key })}
          />
        ))}
      </ul>
    </ol>
  );
};
