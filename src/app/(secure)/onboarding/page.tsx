import { auth } from "@clerk/nextjs/server";
import { ChevronLeftIcon } from "@radix-ui/react-icons";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { type SearchParams } from "nuqs/parsers";
import { PortalPreviewWrapperRSC } from "~/components/admin/portal-preview";
import { VisualWrapper } from "~/components/admin/visual/visual-wrapper";
import { onboardingParsesCache } from "~/components/onboarding/onboarding.parsers";
import { Stepper } from "~/components/onboarding/Stepper";
import { StepperSelector } from "~/components/onboarding/StepperSelector";
import { LocaleSwitcherWrapper } from "~/components/shared/locale-switcher";
import { Button } from "~/components/ui/button";
import { Divider } from "~/components/ui/separator";
import { api } from "~/trpc/server";

export default async function OnboardingPage({ searchParams }: { searchParams: SearchParams }) {
  onboardingParsesCache.parse(searchParams);

  const { sessionClaims } = auth();
  const [contactData, shouldShowLive] = await Promise.all([
    api.vCard.get(),
    api.viewer.shouldShowLive(),
  ]);

  const t = await getTranslations("admin.onboarding");

  if (!sessionClaims?.username) {
    return redirect("/auth/signup");
  }

  return (
    <>
      <section className="hidden w-max max-w-[280px] flex-col gap-8 border-r bg-muted p-4 md:flex md:py-8">
        <header className="flex items-center gap-2 font-medium">
          <Image
            src="/logo-light.png"
            alt="concard-logo"
            width={32}
            height={32}
            className="rounded-lg"
          />
          <p>ConCard</p>
        </header>

        <Stepper />

        <div className="mt-auto flex flex-col items-start gap-1 px-0 md:px-4">
          <LocaleSwitcherWrapper />
          <Divider className="mb-3 mt-0" />
          <Button variant="link" asChild>
            <Link href="/admin">
              <ChevronLeftIcon /> {t("return")}
            </Link>
          </Button>
        </div>
      </section>

      <section className="h-full w-full overflow-auto bg-white">
        <StepperSelector
          initialData={{ contact: contactData, shareLink: shouldShowLive }}
          session={sessionClaims}
          components={{
            portal: <PortalPreviewWrapperRSC hideAlerts username={sessionClaims.username} />,
            visual: <VisualWrapper />,
          }}
        />
      </section>
    </>
  );
}
