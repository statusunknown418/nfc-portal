"use client";

import { api, type RouterOutputs } from "~/trpc/react";

export const PortalPreview = ({
  initialData,
  username,
}: {
  initialData: RouterOutputs["portals"]["get"];
  username: string;
}) => {
  const { data: portal } = api.portals.get.useQuery({ username }, { initialData });

  return (
    <article
      id="portal-device-preview"
      className="mx-auto h-full max-h-[550px] min-h-[550px] w-full max-w-xs overflow-y-auto overscroll-y-contain rounded-[32px] border-4 bg-white p-4 shadow-lg"
      style={{
        background: portal.data?.theme.background.background,
        color: portal.data?.theme.foregroundColor,
      }}
    >
      <p>Something</p>
      <p>Something</p>
      <p>Something</p>
      <p>Something</p>
      <p>Something</p>
    </article>
  );
};
