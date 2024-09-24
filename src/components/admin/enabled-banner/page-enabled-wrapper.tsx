import { api } from "~/trpc/server";
import { PageEnabled } from "./PageEnabled";
import { Skeleton } from "~/components/ui/skeleton";

export const PageEnabledWrapperRSC = async () => {
  const data = await api.viewer.shouldShowLive();

  return <PageEnabled initialData={data} />;
};

export const PageEnabledWrapperLoader = () => {
  return (
    <section className="flex w-full flex-col gap-4">
      <header className="flex items-center gap-1">
        <h2 className="text-2xl font-bold">Welcome</h2>
        <Skeleton className="h-6 w-20" />
      </header>

      <Skeleton className="h-14 w-full" />

      <Skeleton className="h-14 w-full" />
    </section>
  );
};
