"use client";

import {
  ExclamationTriangleIcon,
  ExternalLinkIcon,
  IdCardIcon,
  RocketIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";
import { useState } from "react";
import { purchaseStatusToText } from "~/lib/utils";
import { api, type RouterOutputs } from "~/trpc/react";
import { Alert, AlertDescription, AlertTitle } from "../../ui/alert";
import { Button } from "../../ui/button";
import { CopyButton } from "../../ui/copy-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { useTranslations } from "next-intl";

export const PageEnabled = ({
  initialData,
}: {
  initialData: RouterOutputs["viewer"]["shouldShowLive"];
}) => {
  const [data] = api.viewer.shouldShowLive.useSuspenseQuery(undefined, { initialData });
  const [onboardingPending, setOnboard] = useState(!data?.hasCompletedOnboarding);
  const utils = api.useUtils();
  const t = useTranslations("admin");

  const { mutate: forceCompletion } = api.viewer.setOnboardingStep.useMutation();

  const handleClick = () => {
    forceCompletion({ forceCompleted: true, step: "finale" });
    setOnboard(false);
    void utils.viewer.shouldShowLive.invalidate();
  };

  const onCopy = async () => {
    await navigator.clipboard.writeText(
      `https://concard.app/${data.username}?ktp=${data.pageHashKey}`,
    );
  };

  const WarningAlert = () => {
    return (
      <Alert variant="warning" className="relative mt-4">
        <ExclamationTriangleIcon className="h-5 w-5" />

        <AlertTitle>{t("onboarding.banners.pending.title")}</AlertTitle>

        <AlertDescription>{t("onboarding.banners.pending.description")}</AlertDescription>

        <Link
          className="mt-1 flex items-center gap-1 text-muted-foreground underline hover:text-indigo-500 hover:text-primary"
          href={`/onboarding?step=${data.onboardingStep}`}
        >
          {t("onboarding.banners.pending.pickUp")} <ExternalLinkIcon />
        </Link>
      </Alert>
    );
  };

  const SuccessAlert = () => {
    return (
      <Alert variant="indigo" className="relative mt-4">
        <RocketIcon className="h-5 w-5" />

        <AlertTitle className="text-foreground">{t("onboarding.banners.done.title")}</AlertTitle>

        <AlertDescription className="flex items-center gap-1">
          <Link
            target="_blank"
            href={`https://concard.app/${data.username}?ktp=${data.pageHashKey}`}
            className="text-base underline-offset-1 hover:text-indigo-500 hover:underline"
            onCopy={(e) => {
              e.stopPropagation();
              e.preventDefault();
              void onCopy();
            }}
          >
            https://concard.app/{data.username}
          </Link>

          <CopyButton text={`https://concard.app/${data.username}?ktp=${data.pageHashKey}`} />
        </AlertDescription>
      </Alert>
    );
  };

  return (
    <article className="flex w-full flex-col">
      <h1 className="text-2xl font-bold">
        {t("dashboard.welcome")} {data.username}!
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">{t("dashboard.description")}</p>

      <Alert className="relative mt-4">
        <IdCardIcon className="h-5 w-5" />

        <AlertTitle className="text-foreground">{t("dashboard.banners.card.title")}</AlertTitle>

        <AlertDescription className="flex items-center gap-1">
          {t("dashboard.banners.card.description")}{" "}
          <strong>{purchaseStatusToText(data.cardShippingStatus ?? "awaiting_purchase")}</strong>
        </AlertDescription>

        {data.cardShippingStatus === "awaiting_purchase" && (
          <AlertDescription className="mt-1 text-muted-foreground">
            <p className="inline-flex">{t("dashboard.banners.card.awaitingPurchase")}</p>{" "}
            <Link
              href="/admin/cards"
              className="items-center gap-1 text-wrap underline underline-offset-1 transition-all hover:text-primary"
            >
              {t("dashboard.banners.card.awaitingPurchasePart2")}{" "}
              <ExternalLinkIcon className="inline-flex" />
            </Link>
          </AlertDescription>
        )}
      </Alert>

      {data.hasCompletedOnboarding ? <SuccessAlert /> : <WarningAlert />}

      <Dialog open={onboardingPending} onOpenChange={setOnboard}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("onboarding.banners.continueModal.title")}</DialogTitle>

            <DialogDescription>
              {t("onboarding.banners.continueModal.description")}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button className="w-full" asChild>
              <Link href={`/onboarding?step=${data.onboardingStep}`}>
                {t("onboarding.banners.continueModal.takeMeThere")}
              </Link>
            </Button>

            <Button variant="destructive_ghost" className="w-full" onClick={handleClick}>
              {t("onboarding.banners.continueModal.doNotShowAgain")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </article>
  );
};
