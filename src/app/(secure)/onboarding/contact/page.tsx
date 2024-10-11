import { RedirectToSignIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { getTranslations } from "next-intl/server";
import { type SearchParams } from "nuqs/parsers";
import { contactStepsCache } from "~/components/onboarding/contactStep.parsers";
import { ContactStepper } from "~/components/onboarding/ContactStepper";
import { api } from "~/trpc/server";

export default async function ContactPage({ searchParams }: { searchParams: SearchParams }) {
  const contact = await api.vCard.get();
  const clerk = auth();
  const session = clerk.sessionClaims;
  const t = await getTranslations("admin.onboarding.steps.contact");

  contactStepsCache.parse(searchParams);

  if (!session?.username) {
    return <RedirectToSignIn />;
  }

  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col items-center justify-center gap-4">
      <ContactStepper initialData={contact} user={session} />

      <p className="-mt-4 w-full rounded-b-xl border-x border-b bg-white p-2 text-center text-sm text-muted-foreground">
        {t("optionalFields")}
      </p>
    </section>
  );
}
