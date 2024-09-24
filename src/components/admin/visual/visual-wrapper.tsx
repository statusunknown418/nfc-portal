import { api } from "~/trpc/server";
import { VisualCustomizationForm } from "./VisualCustomizationForm";
import { Skeleton } from "~/components/ui/skeleton";
import { Divider } from "~/components/ui/separator";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

export const VisualWrapper = async () => {
  const data = await api.visuals.get();
  const { sessionClaims, userId } = auth();

  /**
   * TODO: Probably change this to something better
   */
  if (!sessionClaims || !userId) {
    return redirect("/");
  }

  return <VisualCustomizationForm defaultValues={data} username={sessionClaims.username} />;
};

export const VisualWrapperLoader = () => {
  return (
    <div className="grid h-full grid-cols-1 gap-4">
      <section className="flex flex-col gap-4">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
        <Divider />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </section>
    </div>
  );
};
