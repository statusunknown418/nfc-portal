"use client";

import { useEffect, useState } from "react";
import { Spinner } from "~/components/shared/Spinner";
import { useFrameSyncSender } from "~/lib/hooks/use-frame-sync";
import { cardPreviewsStore } from "~/lib/stores/cardPreviews";
import { api, type RouterOutputs } from "~/trpc/react";

export const PortalPreview = ({
  initialData,
  username,
  bypassKey,
}: {
  initialData: RouterOutputs["viewer"]["previewPortal"];
  username: string;
  bypassKey?: string;
}) => {
  const { data: portal } = api.viewer.previewPortal.useQuery(undefined, { initialData });

  const renderKey = JSON.stringify(portal);

  const setContactPreview = cardPreviewsStore((s) => s.setPreview);
  const iframeRef = useFrameSyncSender(renderKey);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!portal?.contactJSON) {
      return;
    }

    setContactPreview(portal?.contactJSON);
  }, [portal?.contactJSON, setContactPreview]);

  return (
    <>
      {!loaded && (
        <div className="absolute inset-0 flex h-full w-full animate-pulse items-center justify-center bg-gradient-to-b from-muted">
          <Spinner />
        </div>
      )}

      <iframe
        ref={iframeRef}
        onLoad={() => setLoaded(true)}
        src={`/${username}?ktp=${portal?.pageHashKey}&bypassKey=${bypassKey}`}
        loading="lazy"
        className="h-full min-h-[640px] w-full"
      />
    </>
  );
};
