import { PlusIcon } from "@radix-ui/react-icons";
import { type Session } from "next-auth";
import { Suspense } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  ContactDataLoading,
  ContactDataWrapper,
} from "../contact/contact-data/contact-data-wrapper";
import {
  PageEnabledWrapperLoader,
  PageEnabledWrapperRSC,
} from "../enabled-banner/page-enabled-wrapper";
import { LinksWrapperLoader, LinksWrapperRSC } from "./links-list/links-wrapper";
import { NewLinkDrawer } from "./new-link";

export const LinksViewRSC = ({ jwt }: { jwt: Session }) => {
  return (
    <div className="flex h-full flex-grow flex-col items-center gap-4">
      <Breadcrumb className="self-start">
        <BreadcrumbList>
          <BreadcrumbItem>Dashboard</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbPage>Links and contact information</BreadcrumbPage>
        </BreadcrumbList>
      </Breadcrumb>

      <Suspense fallback={<PageEnabledWrapperLoader />}>
        <PageEnabledWrapperRSC />
      </Suspense>

      <Tabs defaultValue="links" className="mt-4 flex w-full flex-col gap-2">
        <TabsList className="h-[44px] w-max justify-start rounded-full border border-primary/20">
          <TabsTrigger
            value="contact"
            className="h-[36px] min-w-32 flex-grow rounded-full border border-transparent data-[state=active]:border-indigo-500 data-[state=active]:bg-indigo-100 data-[state=active]:font-semibold data-[state=active]:text-indigo-600"
          >
            Contact
          </TabsTrigger>

          <TabsTrigger
            value="links"
            className="h-[36px] min-w-32 flex-grow rounded-full border border-transparent data-[state=active]:border-indigo-500 data-[state=active]:bg-indigo-100 data-[state=active]:font-semibold data-[state=active]:text-indigo-600"
          >
            Links
          </TabsTrigger>
        </TabsList>

        <TabsContent value="links">
          <section className="grid w-full grid-cols-1 gap-4">
            <p className="text-sm text-muted-foreground">
              Here you can manage all your links, you can also import them from other places, this
              is useful for you to showcase more of your work.
            </p>

            <article className="flex w-full flex-col items-center gap-2 sm:flex-row sm:justify-start sm:gap-0">
              <NewLinkDrawer username={jwt?.user.username ?? ""} />

              <Button size="lg" variant="outline" className="w-full sm:rounded-l-none">
                <PlusIcon />
                Import links
              </Button>
            </article>

            <article className="mt-4 flex h-full w-full flex-col gap-4">
              <Suspense fallback={<LinksWrapperLoader />}>
                <LinksWrapperRSC />
              </Suspense>
            </article>
          </section>
        </TabsContent>

        <TabsContent value="contact">
          <p className="mb-4 text-sm text-muted-foreground">
            Manage your contact information here, this is what every person you give your card to
            will see, additionally it is possible to hide it from your public page if needed.
          </p>

          <Suspense fallback={<ContactDataLoading />}>
            <ContactDataWrapper />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
};
