import { auth } from "@clerk/nextjs/server";
import { Skeleton } from "~/components/ui/skeleton";
import { api, HydrateClient } from "~/trpc/server";
import { LinksSortableList } from "./LinksList";

export async function LinksWrapperRSC() {
  const data = await api.links.all();
  const { sessionClaims } = auth();

  return (
    <HydrateClient>
      <LinksSortableList initialData={data} username={sessionClaims?.username ?? ""} />
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
