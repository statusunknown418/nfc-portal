import { redirect } from "next/navigation";
import { Spinner } from "~/components/shared/Spinner";
import { api } from "~/trpc/server";
import { PortalPreview } from "./PortalPreview";

export const PortalPreviewWrapperRSC = async ({ username }: { username: string }) => {
  const data = await api.portals.get({ username });

  if (!data.data) {
    return redirect("/auth/login?error=no-data-found");
  }

  return (
    <>
      <article
        id="portal-device-preview"
        className="mx-auto max-h-[740px] min-h-[640px] w-full min-w-[310px] max-w-[330px] overflow-y-auto overscroll-y-contain rounded-[40px] border-4 shadow-lg shadow-black/50"
      >
        <PortalPreview initialData={data} username={username} />
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
