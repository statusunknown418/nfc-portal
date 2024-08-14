import { Spinner } from "~/components/shared/Spinner";
import { api, HydrateClient } from "~/trpc/server";
import { PortalPreview } from "./PortalPreview";

export const PortalPreviewWrapperRSC = async ({ username }: { username: string }) => {
  const data = await api.portals.get({ username });

  return (
    <HydrateClient>
      <article
        id="portal-device-preview"
        className="mx-auto h-full max-h-[550px] min-h-[550px] w-full max-w-xs overflow-y-auto overscroll-y-contain rounded-[32px] border-4 shadow-lg shadow-black/50"
      >
        <PortalPreview initialData={data} username={username} />
      </article>
    </HydrateClient>
  );
};

export const PortalPreviewWrapperLoader = () => {
  return (
    <article
      id="portal-device-preview"
      className="mx-auto flex h-full max-h-[550px] min-h-[550px] w-full max-w-xs items-center justify-center overflow-y-auto overscroll-y-contain rounded-[32px] border-4 shadow-lg"
    >
      <Spinner />
    </article>
  );
};
