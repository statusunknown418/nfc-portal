import { Suspense } from "react";
import {
  SignaturesListLoader,
  SignaturesListWrapper,
} from "~/components/admin/signatures/signatures-list";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "~/components/ui/breadcrumb";

export default function SignaturesPage() {
  return (
    <section>
      <Breadcrumb className="self-start">
        <BreadcrumbList>
          <BreadcrumbItem>Dashboard</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbPage>Email signatures</BreadcrumbPage>
        </BreadcrumbList>
      </Breadcrumb>

      <h2 className="mt-4 text-2xl font-bold">Email signatures</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Here you can manage all your links, you can also import them from other places, this is
        useful for you to showcase more of your work.
      </p>

      <section className="mt-4">
        <Suspense fallback={<SignaturesListLoader />}>
          <SignaturesListWrapper />
        </Suspense>
      </section>
    </section>
  );
}
