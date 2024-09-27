import { api } from "~/trpc/server";
import { AllSignatures } from "./AllSignatures";
import { Skeleton } from "~/components/ui/skeleton";

export const SignaturesListWrapper = async () => {
  const data = await api.vCard.get();

  return <AllSignatures initialData={data} />;
};

export const SignaturesListLoader = () => {
  return (
    <div className="flex h-full w-full flex-col items-center gap-4">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
    </div>
  );
};
