import { RedirectToSignIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { useTranslations } from "next-intl";
import { PortalPreviewWrapperRSC } from "~/components/admin/portal-preview";
import { VisualWrapper } from "~/components/admin/visual/visual-wrapper";

export default function PortalPage() {
  const clerk = auth();
  const sessionClaims = clerk.sessionClaims;

  const t = useTranslations("admin.onboarding.steps.portal");

  if (!sessionClaims?.username) {
    return <RedirectToSignIn />;
  }

  return (
    <section className="flex flex-col gap-4 px-4 xl:px-0">
      <article>
        <h3 className="text-2xl font-semibold tracking-wide">{t("title")}</h3>
        <p className="mt-1 text-muted-foreground">{t("description")}</p>
      </article>

      <article className="flex flex-col gap-4 overflow-auto lg:flex-row lg:gap-12">
        <div className="lg:w-2/3">
          <VisualWrapper />
        </div>

        <div>
          <PortalPreviewWrapperRSC
            hideAlerts
            username={sessionClaims.username}
            className="md:!sticky md:!top-0"
          />
        </div>
      </article>
    </section>
  );
}
