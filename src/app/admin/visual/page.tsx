import { Suspense } from "react";
import { VisualWrapper, VisualWrapperLoader } from "~/components/admin/visual/visual-wrapper";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";

export default async function VisualCustomizationPage() {
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

      <article className="relative mt-4 flex h-full w-full items-start justify-center rounded-lg lg:mt-0"></article>
    </section>
  );
}
