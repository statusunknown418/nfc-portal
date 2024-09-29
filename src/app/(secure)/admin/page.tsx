import { auth } from "@clerk/nextjs/server";
import { Suspense } from "react";
import { LinksViewRSC } from "~/components/admin/links/links-view";
import {
  PortalPreviewWrapperLoader,
  PortalPreviewWrapperRSC,
} from "~/components/admin/portal-preview";
import GridPattern from "~/components/magicui/grid-pattern";
import { Alert, AlertTitle } from "~/components/ui/alert";
import { cn } from "~/lib/utils";

export default async function AdminPage() {
  const { userId, sessionClaims } = auth();

  if (!sessionClaims || !userId) {
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

  const username = sessionClaims.username;

  return (
    <section className="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:justify-between">
      <LinksViewRSC jwt={sessionClaims} />

      <aside className="hidden flex-grow gap-4 py-6 pl-6 ring-0 lg:sticky lg:inset-0 lg:block lg:h-[calc(100vh-64px)]">
        <section className="flex h-full flex-col items-center justify-center gap-8">
          <Suspense>
            {!!username && (
              <Suspense fallback={<PortalPreviewWrapperLoader />}>
                <PortalPreviewWrapperRSC username={sessionClaims.username} />
              </Suspense>
            )}

            {!username && (
              <Alert variant="destructive">
                <AlertTitle>This is weird, we were unable to find your username</AlertTitle>
              </Alert>
            )}
          </Suspense>
        </section>

        <GridPattern
          className={cn(
            "[mask-image:radial-gradient(700px_circle_at_center,white,transparent)]",
            "absolute inset-0 -z-10 size-full skew-y-12",
          )}
        />
      </aside>
    </section>
  );
}
