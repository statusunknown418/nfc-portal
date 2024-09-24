import { redirect } from "next/navigation";
import { Spinner } from "~/components/shared/Spinner";
import { api } from "~/trpc/server";
import { PortalPreview } from "./PortalPreview";

export const PortalPreviewWrapperRSC = async ({ username }: { username: string }) => {
  const portal = await api.portals.get({ username, bypass: true });

  if (!portal.data) {
    return redirect("/auth/login?error=no-data-found");
  }

  return (
    <>
      <article
        id="portal-device-preview"
        className="relative mr-4 max-h-[740px] min-h-[640px] w-full min-w-[310px] max-w-[330px] self-center justify-self-center overflow-hidden overscroll-y-contain rounded-[52px] border-[6px] border-primary/80 shadow-lg shadow-black"
      >
        <PortalPreview initialData={portal} username={username} />
      </article>
    </>
  );
};

export const PortalPreviewWrapperLoader = () => {
  return (
    <article
      id="portal-device-preview"
      className="mx-auto flex h-full max-h-[640px] w-full min-w-[310px] max-w-[330px] items-center justify-center overflow-y-auto overscroll-y-contain rounded-[40px] border-4 shadow-lg"
    >
      <Spinner />
    </article>
  );
};
