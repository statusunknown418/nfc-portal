import { RedirectToSignIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { CheckFat } from "@phosphor-icons/react/dist/ssr";
import { useTranslations } from "next-intl";
import { PortalPreviewWrapperRSC } from "~/components/admin/portal-preview";
import { VisualWrapper } from "~/components/admin/visual/visual-wrapper";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";

export default function PortalPage() {
  const clerk = auth();
  const sessionClaims = clerk.sessionClaims;

  const t = useTranslations("admin.onboarding.steps.portal");

  if (!sessionClaims?.username) {
    return <RedirectToSignIn />;
  }

  return (
    <section className="relative flex flex-col gap-4 px-4 xl:px-0">
      <Alert variant="success" className="break-words pl-8">
        <CheckFat weight="duotone" className="size-8" />
        <AlertTitle className="text-base/4">
          Siempre puedes seguir personalizando tu portal!
        </AlertTitle>
        <AlertDescription className="break-words">
          No te preocupes si parecen ser muchas opciones, una vez que completes los pasos del
          onboarding te redirigiremos al <kbd>dashboard</kbd> el cual contiene más opciones para
          seguir personalizando tu portal si así lo deseas!
        </AlertDescription>
      </Alert>

      <article className="mt-2">
        <h3 className="text-2xl font-semibold tracking-wide">{t("title")}</h3>
        <p className="mt-1 text-muted-foreground">{t("description")}</p>
      </article>

      <article className="flex flex-col gap-4 overflow-auto lg:flex-row lg:gap-20">
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
