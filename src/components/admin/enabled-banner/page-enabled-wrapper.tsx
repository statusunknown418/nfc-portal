import { api } from "~/trpc/server";
import { PageEnabled } from "./PageEnabled";
import { Skeleton } from "~/components/ui/skeleton";

export const PageEnabledWrapperRSC = async () => {
  const data = await api.viewer.shouldShowLive();

  return <PageEnabled initialData={data} />;
};

export const PageEnabledWrapperLoader = () => {
  return <Skeleton className="h-14 w-full" />;
};
