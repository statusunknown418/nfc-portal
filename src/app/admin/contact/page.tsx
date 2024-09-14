import { Suspense } from "react";
import {
  ContactDataLoading,
  ContactDataWrapper,
} from "~/components/admin/contact/contact-data/contact-data-wrapper";
import DotPattern from "~/components/magicui/dot-pattern";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { cn } from "~/lib/utils";
import CardFlipper from "~/components/ui/CardFlipper";
import { CardPreview } from "~/components/admin/contact/CardPreview";

export default async function ContactPage() {
  return (
    <section className="grid h-full w-full grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
      <section className="flex flex-col gap-4">
        <Breadcrumb className="self-start">
          <BreadcrumbList>
            <BreadcrumbItem>Dashboard</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbPage>Contact</BreadcrumbPage>
          </BreadcrumbList>
        </Breadcrumb>

        <header>
          <h1 className="text-2xl font-bold">Contact information</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your contact information here, this is what every person you give your card to
            will see, additionally it is possible to hide it from your public page if needed.
          </p>
        </header>

        <Suspense fallback={<ContactDataLoading />}>
          <ContactDataWrapper />
        </Suspense>
      </section>

      <CardFlipper />
    </section>
  );
}
