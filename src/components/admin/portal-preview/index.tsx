import { redirect } from "next/navigation";
import { Spinner } from "~/components/shared/Spinner";
import { env } from "~/env";
import { api } from "~/trpc/server";
import { PurchaseCardModal } from "../PurchaseCard";
import { ShareLink } from "../ShareLink";
import { PortalPreview } from "./PortalPreview";

export const PortalPreviewWrapperRSC = async ({ username }: { username: string }) => {
  const data = await api.portals.get({ username });
  const baseUrl = env.NODE_ENV === "development" ? "http://localhost:3000" : `near.industries`;

  if (!data.data) {
    return redirect("/auth/login?error=no-data-found");
  }

  return (
    <>
      <article className="flex gap-4">
        <ShareLink
          username={username}
          pageHashKey={data.data.pageHashKey ?? ""}
          baseUrl={baseUrl}
        />

        <PurchaseCardModal />
      </article>

      <article
        id="portal-device-preview"
        className="mx-auto h-full max-h-[740px] min-h-[640px] w-full min-w-[310px] max-w-[330px] overflow-y-auto overscroll-y-contain rounded-[40px] border-4 shadow-lg shadow-black/50"
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
      className="mx-auto mt-[100px] flex max-h-[740px] min-h-[740px] w-full min-w-[310px] max-w-[330px] items-center justify-center overflow-y-auto overscroll-y-contain rounded-[40px] border-4 shadow-lg"
    >
      <Spinner />
    </article>
  );
};
