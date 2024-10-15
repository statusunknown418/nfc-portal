import { type Metadata } from "next";
import { Suspense } from "react";
import {
  ContactDataLoading,
  ContactDataWrapper,
} from "~/components/admin/contact/contact-data/contact-data-wrapper";
import {
  ContactPreviewLoader,
  ContactPreviewWrapper,
} from "~/components/admin/contact/preview/contact-preview-wrapper";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";

export const metadata: Metadata = {
  title: "Información de contacto",
};

export default function ContactPage() {
  return (
    <section className="flex flex-col gap-4">
      <Breadcrumb className="self-start">
        <BreadcrumbList>
          <BreadcrumbItem>Dashboard</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbPage>Contacto</BreadcrumbPage>
        </BreadcrumbList>
      </Breadcrumb>

      <section className="grid h-full w-full grid-cols-1 gap-8 lg:grid-cols-2">
        <article className="flex flex-col gap-4">
          <header>
            <h1 className="text-2xl font-bold">Información de contacto</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Decide qué información personal quieres compartir con tus contactos.
            </p>
          </header>

          <Suspense fallback={<ContactDataLoading />}>
            <ContactDataWrapper />
          </Suspense>
        </article>

        <Suspense fallback={<ContactPreviewLoader />}>
          <ContactPreviewWrapper />
        </Suspense>
      </section>
    </section>
  );
}
