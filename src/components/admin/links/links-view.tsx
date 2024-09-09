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
              https://nfc.nearu.tech/{jwt?.user.username}
            </Link>

            <CopyButton text={`https://nfc.nearu.tech/${jwt?.user.username}`} />
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
