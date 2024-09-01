import { Suspense } from "react";
import {
  ContactDataLoading,
  ContactDataWrapper,
} from "~/components/admin/contact/contact-data/contact-data-wrapper";
import DotPattern from "~/components/magicui/dot-pattern";
import { CardBody, CardContainer, CardItem } from "~/components/ui/3d-card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { cn } from "~/lib/utils";

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

        <div className={cn("rounded-lg border border-dashed bg-white p-4")}>
          <Label className="flex items-center gap-2">
            <Switch />
            Enable contact information visibility
          </Label>
        </div>

        <Suspense fallback={<ContactDataLoading />}>
          <ContactDataWrapper />
        </Suspense>
      </section>

      <article className="relative mt-4 flex h-full w-full items-start justify-center rounded-lg lg:mt-0">
        <CardContainer className="h-full w-full" containerClassName={cn("h-full w-full z-10")}>
          <CardBody className="group/card flex w-full items-start justify-center">
            <CardItem
              translateZ="100"
              rotateX={15}
              rotateZ={5}
              className="flex h-[220px] w-[380px] flex-col justify-between rounded-xl bg-primary p-6 text-sm text-primary-foreground shadow-md shadow-black/50 group-hover:shadow-xl md:h-64"
            >
              <div className="flex justify-between">
                <p className="font-medium text-muted-foreground">NearU</p>
                <p className="text-muted-foreground">#0000001</p>
              </div>

              <div className="flex justify-between">
                <p>Alvaro @status.unknown418</p>
                <p>stackkstudios.com</p>
              </div>
            </CardItem>
          </CardBody>
        </CardContainer>

        <DotPattern
          className={cn("z-0 w-full p-1 opacity-70 [mask-image:linear-gradient(to_bottom)]")}
        />
      </article>
    </section>
  );
}
