import { Share2Icon } from "@radix-ui/react-icons";
import { cookies } from "next/headers";
import { Suspense } from "react";
import { LinksViewRSC } from "~/components/admin/links/links-view";
import {
  PortalPreviewWrapperLoader,
  PortalPreviewWrapperRSC,
} from "~/components/admin/portal-preview";
import { Alert, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { auth } from "~/server/auth";

export default async function AdminPage() {
  const jwt = await auth();
  const username = jwt?.user.username || cookies().get("decided-username")?.value || "";

  if (!jwt) {
    return (
      <section>
        <h1>Something weird happened...</h1>
        <p>
          Looks like we were unable to recognize you. Please{" "}
          <a className="underline" href="/auth/login">
            login
          </a>{" "}
          again.
        </p>
      </section>
    );
  }

  return (
    <section className="flex h-max flex-col gap-4 lg:grid lg:grid-cols-2 lg:justify-between">
      <LinksViewRSC jwt={jwt} />

      <aside className="hidden flex-grow gap-4 pl-6 ring-0 lg:sticky lg:inset-0 lg:block lg:h-[calc(100vh-64px)]">
        <section className="flex h-full flex-col items-center justify-center gap-10">
          <Button className="max-w-max rounded-full" variant="primary" size="lg">
            <Share2Icon />
            Share
          </Button>

          <Suspense>
            {!!username && (
              <Suspense fallback={<PortalPreviewWrapperLoader />}>
                <PortalPreviewWrapperRSC username={username} />
              </Suspense>
            )}

            {!username && (
              <Alert variant="destructive">
                <AlertTitle>This is weird, we couldn&apos;t find your username</AlertTitle>
              </Alert>
            )}
          </Suspense>

          <h3 className="text-center text-muted-foreground">Preview</h3>
        </section>
      </aside>
    </section>
  );
}
