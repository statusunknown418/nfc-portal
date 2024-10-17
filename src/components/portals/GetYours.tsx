"use client";

import { SignUpButton } from "@clerk/nextjs";
import { useState } from "react";
import { api, type RouterOutputs } from "~/trpc/react";

export const GetYours = ({
  shouldShow = true,
  colors,
}: {
  shouldShow?: boolean;
  colors: RouterOutputs["visuals"]["get"];
}) => {
  const [show, setShow] = useState(shouldShow);
  const _action = api.portals.removeJoinBanner.useMutation({
    onSuccess: () => {
      setShow(false);
    },
  });

  if (!show) {
    return;
  }

  return (
    <div className="mt-10 px-4">
      <SignUpButton>
        <button
          className="flex w-full flex-col items-center justify-center p-3 text-sm font-medium"
          style={{
            color: colors?.theme.colors.foreground,
          }}
        >
          🚀 Únete a ConCard!
        </button>
      </SignUpButton>
    </div>
  );
};
