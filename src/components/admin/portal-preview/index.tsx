import { api } from "~/trpc/server";
import { PortalPreview } from "./PortalPreview";

export const PortalPreviewWrapperRSC = async ({ username }: { username: string }) => {
  const data = await api.portals.get({ username });

  return <PortalPreview initialData={data} username={username} />;
};
