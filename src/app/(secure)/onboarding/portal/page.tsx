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
    <section className="flex flex-col gap-4">
      <article>
        <h3 className="text-2xl font-semibold tracking-wide">{t("title")}</h3>
        <p className="mt-1 text-muted-foreground">{t("description")}</p>
      </article>

      <article className="flex flex-col gap-4 overflow-auto lg:flex-row lg:gap-12">
        <VisualWrapper />
        <PortalPreviewWrapperRSC hideAlerts username={sessionClaims.username} />
      </article>
    </section>
  );
}
