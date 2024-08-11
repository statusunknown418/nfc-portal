import { api, HydrateClient } from "~/trpc/server";
import { LinksSortableList } from "./LinksList";
import { Skeleton } from "~/components/ui/skeleton";

export async function LinksWrapperRSC() {
  const data = await api.links.all();

  return (
    <HydrateClient>
      <LinksSortableList initialData={data} />
    </HydrateClient>
  );
}

export const LinksWrapperLoader = () => {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  );
};
