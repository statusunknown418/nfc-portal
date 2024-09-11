import { PlusIcon, RocketIcon } from "@radix-ui/react-icons";
import { type Session } from "next-auth";
import Link from "next/link";
import { Suspense } from "react";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { Button } from "~/components/ui/button";
import { CopyButton } from "~/components/ui/copy-button";
import { LinksWrapperLoader, LinksWrapperRSC } from "./links-list/links-wrapper";
import { NewLinkDrawer } from "./new-link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  ContactDataLoading,
  ContactDataWrapper,
} from "../contact/contact-data/contact-data-wrapper";

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

      <article className="flex w-full flex-col">
        <h1 className="text-2xl font-bold">Welcome {jwt?.user.username}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Here you can manage everything that shows up on your NFC portal page.
        </p>

        <Alert variant="indigo" className="relative mt-4">
          <RocketIcon className="text-indigo-600" />
          <AlertTitle className="text-foreground"> Your page is LIVE!</AlertTitle>
          <AlertDescription className="flex items-center gap-1">
            <Link
              href="https://nfc.nearu.tech"
              className="text-sm text-indigo-600 underline hover:text-indigo-500"
            >
              https://nfc.nearu.tech/{jwt?.user.username}
            </Link>

            <CopyButton text={`https://nfc.nearu.tech/${jwt?.user.username}`} />
          </AlertDescription>
        </Alert>
      </article>

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
          <Suspense fallback={<ContactDataLoading />}>
            <ContactDataWrapper />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
};
