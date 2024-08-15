import { RocketIcon, CopyIcon, PlusIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { Suspense } from "react";
import { Button } from "~/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "~/components/ui/alert";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "~/components/ui/breadcrumb";
import { type Session } from "next-auth";
import { NewLinkDrawer } from "./new-link";
import { LinksWrapperLoader, LinksWrapperRSC } from "./links-list/links-wrapper";

export const LinksViewRSC = ({ jwt }: { jwt: Session }) => {
  return (
    <div className="flex h-full flex-grow flex-col items-center gap-4">
      <Breadcrumb className="self-start">
        <BreadcrumbList>
          <BreadcrumbItem>Dashboard</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbPage>Links</BreadcrumbPage>
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
              https://nfc.nearu.tech
            </Link>

            <Button variant="ghost" size="icon" className="h-8 w-8 text-foreground">
              <CopyIcon />
            </Button>
          </AlertDescription>
        </Alert>
      </article>

      <div className="mt-2 flex w-full flex-col items-center justify-start gap-2 sm:flex-row">
        <NewLinkDrawer username={jwt?.user.username ?? ""} />

        <Button size="lg" variant="outline" className="w-full">
          <PlusIcon />
          Import links
        </Button>
      </div>

      <article className="mt-2 flex h-full w-full flex-col gap-4">
        <Suspense fallback={<LinksWrapperLoader />}>
          <LinksWrapperRSC />
        </Suspense>
      </article>
    </div>
  );
};
