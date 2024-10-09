import { RedirectToSignIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { Divider } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";
import { api } from "~/trpc/server";
import { VisualCustomizationForm } from "./VisualCustomizationForm";

export const VisualWrapper = async () => {
  const data = await api.visuals.get();
  const { sessionClaims, userId } = auth();

  if (!sessionClaims || !userId) {
    return <RedirectToSignIn />;
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
