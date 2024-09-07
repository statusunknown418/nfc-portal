"use client";

import { useState } from "react";
import { Spinner } from "~/components/shared/Spinner";
import { useFrameSyncSender } from "~/lib/hooks/use-frame-sync";
import { api, type RouterOutputs } from "~/trpc/react";

export const PortalPreview = ({
  initialData,
  username,
}: {
  initialData: RouterOutputs["portals"]["get"];
  username: string;
}) => {
  const { data: portal } = api.portals.get.useQuery({ username }, { initialData });

  const mainKey = portal.data?.links.map((link) => `${JSON.stringify(link)}`).join(",");
  const renderKey = `${mainKey}-${JSON.stringify(portal.data?.theme)}-${portal.data?.bio}-${portal.data?.profileHeader}`;

  const fallbackKey = `${username}-${portal.data?.pageHashKey}`;

  const iframeRef = useFrameSyncSender(renderKey ?? fallbackKey);
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && (
        <div className="flex h-full w-full animate-pulse items-center justify-center bg-muted">
          <Spinner />
        </div>
      )}

      <iframe
        ref={iframeRef}
        onLoad={() => setLoaded(true)}
        src={`/${username}?ktp=${portal.data?.pageHashKey}`}
        loading="lazy"
        className="h-full min-h-full w-full"
      />
    </>
  );
};
