import { ChevronLeftIcon } from "@radix-ui/react-icons";
import { redirect } from "next/navigation";
import { type SearchParams } from "nuqs/parsers";
import { PortalPreviewWrapperRSC } from "~/components/admin/portal-preview";
import { VisualWrapper } from "~/components/admin/visual/visual-wrapper";
import { onboardingParsesCache } from "~/components/onboarding/onboarding.parsers";
import { Stepper } from "~/components/onboarding/Stepper";
import { StepperSelector } from "~/components/onboarding/StepperSelector";
import { Button } from "~/components/ui/button";
import { auth } from "~/server/auth";
import { api } from "~/trpc/server";

export default async function OnboardingPage({ searchParams }: { searchParams: SearchParams }) {
  onboardingParsesCache.parse(searchParams);

  const [contactData, session] = await Promise.all([api.vCard.get(), auth()]);

  if (!session?.user.username) {
    return redirect("/auth/signup");
  }

  return (
    <>
      <section className="hidden w-max max-w-[320px] flex-col gap-8 border-r bg-muted p-4 md:flex md:py-8">
        <header>CC</header>

        <Stepper />

        <Button variant="link" className="mt-auto px-0 md:px-4">
          <ChevronLeftIcon /> Home
        </Button>
      </section>

      <section className="h-full w-full overflow-auto bg-white">
        <StepperSelector
          initialData={{ contact: contactData }}
          session={session}
          components={{
            portal: <PortalPreviewWrapperRSC username={session.user.username} />,
            visual: <VisualWrapper />,
          }}
        />
      </section>
    </>
  );
}
