import { redirect } from "next/navigation";
import { Spinner } from "~/components/shared/Spinner";
import { env } from "~/env";
import { api } from "~/trpc/server";
import { ShareLink, ShareLinkLoader } from "../ShareLink";
import { PortalPreview } from "./PortalPreview";

export const PortalPreviewWrapperRSC = async ({ username }: { username: string }) => {
  const data = await api.portals.get({ username });
  const baseUrl = env.AUTH_URL;

  if (!data.data) {
    return redirect("/auth/login?error=no-data-found");
  }

  return (
    <>
      <ShareLink username={username} pageHashKey={data.data.pageHashKey ?? ""} baseUrl={baseUrl} />

      <article
        id="portal-device-preview"
        className="mx-auto h-full max-h-[640px] min-h-[640px] w-full max-w-[310px] overflow-y-auto overscroll-y-contain rounded-[40px] border-4 shadow-lg shadow-black/50"
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
      className="mx-auto mt-[100px] flex max-h-[640px] min-h-[640px] w-full max-w-[310px] items-center justify-center overflow-y-auto overscroll-y-contain rounded-[40px] border-4 shadow-lg"
    >
      <Spinner />
    </article>
  );
};
