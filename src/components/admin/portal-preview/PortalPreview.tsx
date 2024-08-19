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

  const reRenderKey = portal.data?.links
    .map(
      (link) =>
        `${link.id}-${link.displayText}-${link.url}-${link.layout}-${link.type}-${link.thumbnail}`,
    )
    .join(",");

  const iframeRef = useFrameSyncSender(reRenderKey ?? "sync");
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
        loading="lazy"
        className="h-full min-h-full w-full"
        src={`/${username}?ktp=${portal.data?.pageHashKey}`}
      />
    </>
  );
};
