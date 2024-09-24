import { cookies } from "next/headers";
import { Suspense } from "react";
import { LinksViewRSC } from "~/components/admin/links/links-view";
import {
  PortalPreviewWrapperLoader,
  PortalPreviewWrapperRSC,
} from "~/components/admin/portal-preview";
import GridPattern from "~/components/magicui/grid-pattern";
import { Alert, AlertTitle } from "~/components/ui/alert";
import { cn } from "~/lib/utils";
import { auth } from "~/server/auth";

export default async function AdminPage() {
  const jwt = await auth();
  const username = jwt?.user.username ?? cookies().get("decided-username")?.value ?? "";

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

      <aside className="hidden flex-grow gap-4 py-6 pl-6 ring-0 lg:sticky lg:inset-0 lg:block lg:h-[calc(100vh-64px)]">
        <section className="flex h-full flex-col items-center justify-center gap-8">
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

          <h3 className="text-center tracking-wide text-muted-foreground">Preview</h3>
        </section>

        <GridPattern
          className={cn(
            "[mask-image:radial-gradient(700px_circle_at_center,white,transparent)]",
            "inset-0 -z-10 h-full skew-y-12",
          )}
        />
      </aside>
    </section>
  );
}
