"use client";

import { ExclamationTriangleIcon, IdCardIcon, RocketIcon } from "@radix-ui/react-icons";
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

export const PageEnabled = ({
  initialData,
}: {
  initialData: RouterOutputs["viewer"]["shouldShowLive"];
}) => {
  const [data] = api.viewer.shouldShowLive.useSuspenseQuery(undefined, { initialData });
  const [onboardingPending, setOnboard] = useState(!data?.hasCompletedOnboarding);
  const utils = api.useUtils();

  const { mutate: forceCompletion } = api.viewer.setOnboardingStep.useMutation();

  const handleClick = () => {
    forceCompletion({ forceCompleted: true, step: "finale" });
    setOnboard(false);
    void utils.viewer.shouldShowLive.invalidate();
  };

  const WarningAlert = () => {
    return (
      <Alert variant="warning" className="relative mt-4">
        <ExclamationTriangleIcon className="h-5 w-5" />

        <AlertTitle>Onboarding pending!</AlertTitle>

        <AlertDescription className="flex items-center gap-1">
          It is strongly recommended to complete the onboarding process, this way you can complete
          every step and get your portal active and linked to your business card.
        </AlertDescription>

        <div className="mt-2">
          <Button className="text-primary" variant="secondary_ghost" size="sm" asChild>
            <Link href={`/onboarding?step=${data.onboardingStep}`}>Pick up where you left off</Link>
          </Button>
        </div>
      </Alert>
    );
  };

  const SuccessAlert = () => {
    return (
      <Alert variant="indigo" className="relative mt-4">
        <RocketIcon className="h-5 w-5" />

        <AlertTitle className="text-foreground">Your page is LIVE!</AlertTitle>

        <AlertDescription className="flex items-center gap-1">
          <Link href="https://nfc.nearu.tech" className="text-sm underline hover:text-indigo-500">
            https://nfc.nearu.tech/{data.username}
          </Link>

          <CopyButton text={`https://nfc.nearu.tech/${data.username}?ktp=${data.pageHashKey}`} />
        </AlertDescription>
      </Alert>
    );
  };

  return (
    <article className="flex w-full flex-col">
      <h1 className="text-2xl font-bold">Welcome {data.username}</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Here you can manage everything that shows up on your NFC portal page.
      </p>

      <Alert className="relative mt-4">
        <IdCardIcon className="h-5 w-5" />

        <AlertTitle className="text-foreground">Business Card</AlertTitle>

        <AlertDescription className="flex items-center gap-1">
          Current status:
          <strong>{purchaseStatusToText(data.cardShippingStatus ?? "awaiting_purchase")}</strong>
        </AlertDescription>

        {data.cardShippingStatus === "awaiting_purchase" && (
          <AlertDescription className="mt-2 text-muted-foreground">
            We noticed you haven&apos;t purchased a card yet, please{" "}
            <Link href="/admin/cards" className="text-primary underline underline-offset-1">
              purchase one here to fully unlock all features!
            </Link>
          </AlertDescription>
        )}

        <AlertDescription className="mt-2 italic text-muted-foreground">
          You&apos;ll be notified in every step of the way!
        </AlertDescription>
      </Alert>

      {data.hasCompletedOnboarding ? <SuccessAlert /> : <WarningAlert />}

      <Dialog open={onboardingPending} onOpenChange={setOnboard}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Continue onboarding?</DialogTitle>

            <DialogDescription>
              We&apos;ve noticed you haven&apos;t finished the onboarding process. It is{" "}
              <strong>strongly recommended</strong> that you complete it to get the most out of the
              NFC portal.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button className="w-full" asChild>
              <Link href={`/onboarding?step=${data.onboardingStep}`}>Take me there</Link>
            </Button>

            <Button variant="destructive_ghost" className="w-full" onClick={handleClick}>
              Don&apos;t show again
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </article>
  );
};
