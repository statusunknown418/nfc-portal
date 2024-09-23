"use client";

import { api, type RouterOutputs } from "~/trpc/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import Link from "next/link";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "../../ui/alert";
import { RocketIcon } from "@radix-ui/react-icons";
import { CopyButton } from "../../ui/copy-button";

export const PageEnabled = ({
  initialData,
}: {
  initialData: RouterOutputs["viewer"]["shouldShowLive"];
}) => {
  const [data] = api.viewer.shouldShowLive.useSuspenseQuery(undefined, { initialData });
  const [onboard, setOnboard] = useState(!data?.hasCompletedOnboarding);

  return (
    <article className="flex w-full flex-col">
      <h1 className="text-2xl font-bold">Welcome {data.username}</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Here you can manage everything that shows up on your NFC portal page.
      </p>

      <Alert variant="indigo" className="relative mt-4">
        <RocketIcon className="text-indigo-600" />
        <AlertTitle className="text-foreground"> Your page is LIVE!</AlertTitle>
        <AlertDescription className="flex items-center gap-1">
          <Link href="https://nfc.nearu.tech" className="text-sm underline hover:text-indigo-500">
            https://nfc.nearu.tech/{data.username}
          </Link>

          <CopyButton text={`https://nfc.nearu.tech/${data.username}?ktp=${data.pageHashKey}`} />
        </AlertDescription>
      </Alert>

      <Dialog open={onboard} onOpenChange={setOnboard} defaultOpen modal>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Continue onboarding?</DialogTitle>

            <DialogDescription>
              We&apos;ve noticed you&apos;re not done with the onboarding process.
              <Button variant="link" asChild>
                <Link href={`/onboarding?step=${data?.onboardingStep}`}>
                  Click here to continue!
                </Link>
              </Button>
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button>Take me there</Button>

            <Button variant="destructive_ghost" onClick={() => setOnboard(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </article>
  );
};
