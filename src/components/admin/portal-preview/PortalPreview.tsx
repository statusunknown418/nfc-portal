"use client";

import { useEffect, useState } from "react";
import { Spinner } from "~/components/shared/Spinner";
import { useFrameSyncSender } from "~/lib/hooks/use-frame-sync";
import { cardPreviewsStore } from "~/lib/stores/cardPreviews";
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
  const renderKey = `${mainKey}-${portal.data?.image}-${JSON.stringify(portal.data?.theme)}-${portal.data?.bio}-${portal.data?.profileHeader}-${portal.data?.hasContactInfoLocked}`;

  const fallbackKey = `${username}-${portal.data?.pageHashKey}`;

  const setContactPreview = cardPreviewsStore((s) => s.setPreview);
  const iframeRef = useFrameSyncSender(renderKey ?? fallbackKey);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!portal.data?.contactJSON) {
      return;
    }

    setContactPreview(portal.data?.contactJSON);
  }, [portal.data?.contactJSON, setContactPreview]);

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
        src={`/${username}?ktp=${portal.data?.pageHashKey}`}
        loading="lazy"
        className="h-full min-h-[640px] w-full"
      />
    </>
  );
};
