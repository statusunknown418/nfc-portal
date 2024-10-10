import { RedirectToSignUp } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { type SearchParams } from "nuqs/parsers";
import { contactStepsCache } from "~/components/onboarding/contactStep.parsers";
import { ContactStepper } from "~/components/onboarding/ContactStepper";
import { api } from "~/trpc/server";

export default async function ContactPage({ searchParams }: { searchParams: SearchParams }) {
  const contact = await api.vCard.get();
  const clerk = auth();
  const session = clerk.sessionClaims;

  contactStepsCache.parse(searchParams);

  if (!session?.username) {
    return <RedirectToSignUp />;
  }

  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col items-center justify-center gap-4">
      <ContactStepper initialData={contact} user={session} />

      <p className="text-center text-sm text-muted-foreground">
        Heads up, all fields are optional, but filling them all will provide a better experience for
        your customers.
      </p>
    </section>
  );
}
