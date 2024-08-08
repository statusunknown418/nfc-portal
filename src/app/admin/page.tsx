import { CopyIcon, PlusIcon, RocketIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { Suspense } from "react";
import { LinksWrapperLoader, LinksWrapperRSC } from "~/components/admin/links-list/links-wrapper";
import { NewLinkDrawer } from "~/components/admin/new-link";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { auth } from "~/server/auth";

export default async function AdminPage() {
  const jwt = await auth();

  if (!jwt) {
    return (
      <section>
        <h1>Something weird happened...</h1>
        <p>
          Looks like we were unable to recognize you. Please <a href="/auth/login">login</a> again.
        </p>
      </section>
    );
  }

  return (
    <section className="flex h-full flex-col gap-4 md:gap-8 lg:flex-row">
      <div className="flex h-full flex-grow flex-col items-center gap-6">
        <article className="flex w-full max-w-prose flex-col">
          <h1 className="text-2xl font-bold">Welcome {jwt?.user.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Here you can manage everything that shows up on your NFC portal page.
          </p>

          <Alert variant="indigo" className="relative mt-3">
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

        <div className="mt-2 flex w-full max-w-prose flex-col items-center justify-start gap-2 sm:flex-row">
          <NewLinkDrawer />

          <Button size="lg" variant="outline" className="w-full sm:w-max">
            <PlusIcon />
            Import links
          </Button>
        </div>

        <article className="flex h-full w-full max-w-prose flex-grow flex-col gap-4">
          <Suspense fallback={<LinksWrapperLoader />}>
            <LinksWrapperRSC />
          </Suspense>
        </article>
      </div>

      <article className="inset-0 hidden h-full min-w-[350px] max-w-[350px] rounded-2xl border p-6 shadow-md ring-0 lg:sticky lg:block">
        <div></div>
        <h3 className="text-muted-foreground">Preview</h3>
      </article>
    </section>
  );
}
