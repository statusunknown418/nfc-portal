"use client";

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
    <div className="mt-4 w-full px-4">
      <section
        className="flex w-full flex-col items-center justify-center border p-3"
        style={{
          border: `2px dashed ${colors?.theme.colors.border}`,
          borderRadius: "1rem",
        }}
      >
        <h2
          className="text-sm font-semibold uppercase"
          style={{
            color: colors?.theme.colors.subtle,
          }}
        >
          🚀 Powered by ConCard
        </h2>
      </section>
    </div>
  );
};
