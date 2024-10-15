import { cachedContactQuery } from "~/trpc/server";
import { ContactPreview } from "./ContactPreview";
import { Skeleton } from "~/components/ui/skeleton";

export const ContactPreviewWrapper = async () => {
  const data = await cachedContactQuery({ includeImagePalette: true, includeLinks: true });

  return <ContactPreview initialData={data} />;
};

export const ContactPreviewLoader = () => {
  return (
    <div className="grid max-h-[900px] w-full max-w-lg grid-cols-1 gap-4 justify-self-center rounded-xl">
      <Skeleton className="h-[400px] w-full" />

      <section className="grid grid-cols-1 gap-4 rounded-xl bg-neutral-100 p-4">
        <div className="mt-2 flex flex-col gap-2">
          <Skeleton className="h-10 flex-grow" />
          <Skeleton className="h-10 flex-grow" />
        </div>

        <div className="flex flex-col gap-2">
          <Skeleton className="h-10 flex-grow" />
          <Skeleton className="h-10 flex-grow" />
          <Skeleton className="h-10 flex-grow" />
        </div>

        <div className="flex flex-col gap-2">
          <Skeleton className="h-10 flex-grow" />
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-40" />
        </div>
      </section>
    </div>
  );
};
