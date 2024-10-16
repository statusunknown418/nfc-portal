import { auth } from "@clerk/nextjs/server";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { LinksViewRSC } from "~/components/admin/links/links-view";
import {
  PortalPreviewWrapperLoader,
  PortalPreviewWrapperRSC,
} from "~/components/admin/portal-preview";
import { MobilePreview } from "~/components/admin/portal-preview/MobilePreview";
import { Alert, AlertTitle } from "~/components/ui/alert";

export default async function AdminPage() {
  const { userId, sessionClaims } = auth();
  const t = await getTranslations();

  if (!sessionClaims || !userId) {
    return (
      <section>
        <h1>{t("common.errors.somethingWentWrong")} ...</h1>
        <p>
          {t("common.errors.recognitionFailed")} Please{" "}
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
    <section className="relative flex flex-col gap-4 pb-10 sm:pb-0 lg:grid lg:grid-cols-2 lg:justify-between">
      <LinksViewRSC jwt={sessionClaims} />

      <MobilePreview>
        <Suspense>
          {!!username && (
            <Suspense fallback={<PortalPreviewWrapperLoader />}>
              <PortalPreviewWrapperRSC username={sessionClaims.username} />
            </Suspense>
          )}
        </Suspense>
      </MobilePreview>

      <aside className="relative hidden flex-grow gap-4 py-6 pl-6 ring-0 lg:block">
        <section className="flex h-full flex-col items-center justify-center gap-8">
          <Suspense>
            {!!username && (
              <Suspense fallback={<PortalPreviewWrapperLoader />}>
                <PortalPreviewWrapperRSC username={sessionClaims.username} />
              </Suspense>
            )}

            {!username && (
              <Alert variant="destructive">
                <AlertTitle>{t("common.errors.usernameNotFound")}</AlertTitle>
              </Alert>
            )}
          </Suspense>
        </section>
      </aside>
    </section>
  );
}
