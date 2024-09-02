import { api } from "~/trpc/server";
import { ContactDataForm } from "./ContactDataForm";
import { auth } from "~/server/auth";
import { ToggleContactVisibility } from "../visibility/ToggleContactVisibility";
import { Skeleton } from "~/components/ui/skeleton";

export const ContactDataWrapper = async () => {
  const [data, session] = await Promise.all([api.vCard.get(), auth()]);

  return (
    <>
      <ToggleContactVisibility defaultValues={data?.hasContactInfoLocked ?? false} />
      <ContactDataForm initialData={data} user={session!.user} />
    </>
  );
};

export const ContactDataLoading = () => {
  return (
    <div className="grid w-full grid-cols-1 gap-4">
      <Skeleton className="h-14 w-full" />

      <section className="grid grid-cols-1 gap-4 rounded-xl border p-4">
        <div className="mt-2 flex gap-2">
          <Skeleton className="h-10 flex-grow" />
          <Skeleton className="h-10 flex-grow" />
        </div>

        <div className="flex gap-2">
          <Skeleton className="h-10 flex-grow" />
          <Skeleton className="h-10 flex-grow" />
          <Skeleton className="h-10 flex-grow" />
        </div>

        <div className="flex gap-2">
          <Skeleton className="h-10 flex-grow" />
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-40" />
        </div>

        <div className="flex gap-2">
          <Skeleton className="h-10 flex-grow" />
          <Skeleton className="h-10 flex-grow" />
          <Skeleton className="h-10 flex-grow" />
        </div>

        <div className="flex gap-2">
          <Skeleton className="h-10 flex-grow" />
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-40" />
        </div>

        <div className="flex gap-2">
          <Skeleton className="h-10 flex-grow" />
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-40" />
        </div>
      </section>
    </div>
  );
};
