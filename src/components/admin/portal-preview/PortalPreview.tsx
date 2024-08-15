"use client";

import { useEffect, useRef, useState } from "react";
import { Spinner } from "~/components/shared/Spinner";
import { api, type RouterOutputs } from "~/trpc/react";

export const PortalPreview = ({
  initialData,
  username,
}: {
  initialData: RouterOutputs["portals"]["get"];
  username: string;
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loaded, setLoaded] = useState(false);

  const { data: portal } = api.portals.get.useQuery({ username }, { initialData });

  const reRenderKey = portal.data?.links
    .map((link) => `${link.id}-${link.displayText}-${link.url}`)
    .join(",");

  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage({ type: "reload" });
    }
  }, [reRenderKey]);

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
