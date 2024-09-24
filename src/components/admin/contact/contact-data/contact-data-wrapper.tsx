import { Skeleton } from "~/components/ui/skeleton";
import { api } from "~/trpc/server";
import { ContactDataForm } from "./ContactDataForm";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const ContactDataWrapper = async () => {
  const { sessionClaims } = auth();
  const [data] = await Promise.all([api.vCard.get()]);

  if (!sessionClaims) {
    return redirect("/");
  }

  return <ContactDataForm initialData={data} user={sessionClaims} />;
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
