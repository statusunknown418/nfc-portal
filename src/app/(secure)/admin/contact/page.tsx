import { CardPreview } from "~/components/admin/contact/CardPreview";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";

export default function ContactPage() {
  return (
    <section className="grid h-full w-full grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
      <section className="flex flex-col gap-4">
        <Breadcrumb className="self-start">
          <BreadcrumbList>
            <BreadcrumbItem>Dashboard</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbPage>Card customization</BreadcrumbPage>
          </BreadcrumbList>
        </Breadcrumb>

        <header>
          <h1 className="text-2xl font-bold">Contact info</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Decide what information you want to share with your contacts.
          </p>
        </header>
      </section>

      <CardPreview />
    </section>
  );
}
