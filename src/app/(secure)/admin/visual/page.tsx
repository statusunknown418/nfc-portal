import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import {
  PortalPreviewWrapperLoader,
  PortalPreviewWrapperRSC,
} from "~/components/admin/portal-preview";
import { VisualWrapper, VisualWrapperLoader } from "~/components/admin/visual/visual-wrapper";
import GridPattern from "~/components/magicui/grid-pattern";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { cn } from "~/lib/utils";

export default async function VisualCustomizationPage() {
  const { sessionClaims, userId } = auth();

  if (!sessionClaims || !userId) {
    return redirect("/");
  }

  return (
    <section className="relative grid w-full grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
      <section className="flex flex-col gap-4">
        <Breadcrumb className="self-start">
          <BreadcrumbList>
            <BreadcrumbItem>Dashboard</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbPage>Contact</BreadcrumbPage>
          </BreadcrumbList>
        </Breadcrumb>

        <header>
          <h1 className="text-2xl font-bold">Visual customization</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Customize your portal page here, we plan on adding more options in the future!.
          </p>
        </header>

        <Suspense fallback={<VisualWrapperLoader />}>
          <VisualWrapper />
        </Suspense>
      </section>

      <aside className="hidden flex-grow gap-4 py-6 pl-6 ring-0 lg:sticky lg:inset-0 lg:block lg:h-[calc(100vh-64px)]">
        <section className="relative flex h-full flex-col items-center justify-center gap-4">
          <Suspense>
            <Suspense fallback={<PortalPreviewWrapperLoader />}>
              <PortalPreviewWrapperRSC username={sessionClaims.username} />
            </Suspense>
          </Suspense>

          <GridPattern
            className={cn(
              "[mask-image:radial-gradient(700px_circle_at_center,white,transparent)]",
              "absolute inset-0 -z-10 size-full skew-y-12",
            )}
          />
        </section>
      </aside>
    </section>
  );
}
