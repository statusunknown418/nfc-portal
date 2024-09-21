"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

export const GetYours = ({ shouldShow = true }: { shouldShow?: boolean }) => {
  const [show, setShow] = useState(shouldShow);
  const action = api.portals.removeJoinBanner.useMutation({
    onSuccess: () => {
      setShow(false);
    },
  });

  if (!show) {
    return;
  }

  return (
    <div className="w-full px-4">
      <Alert variant="indigo" className="w-full text-center">
        <AlertTitle className="font-semibold">🚀 Powered by ConCard</AlertTitle>

        <AlertDescription className="text-balance text-xs">
          Get your own personalized NFC business card and digital portal!
        </AlertDescription>
      </Alert>
    </div>
  );
};
