"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Spinner } from "~/components/shared/Spinner";
import { api, type RouterOutputs } from "~/trpc/react";

export const PortalPreview = ({
  initialData,
  username,
}: {
  initialData: RouterOutputs["portals"]["get"];
  username: string;
}) => {
  const { data: portal } = api.portals.get.useQuery({ username }, { initialData });
  const [loaded, setLoaded] = useState(false);
  const reRenderKey = portal.data?.links.map((link) => link.id).join(",");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow?.location.reload();
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
