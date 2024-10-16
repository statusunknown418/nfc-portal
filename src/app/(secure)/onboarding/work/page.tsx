import { RedirectToSignIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { getTranslations } from "next-intl/server";
import { HowToContact } from "~/components/onboarding/HowToContact";
import { api } from "~/trpc/server";

export default async function HowToContactPage() {
  const contact = await api.vCard.get();
  const clerk = auth();
  const session = clerk.sessionClaims;
  const t = await getTranslations("admin.onboarding.steps.contact");

  if (!session?.username) {
    return <RedirectToSignIn />;
  }

  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col items-center justify-center gap-4">
      <HowToContact initialData={contact} user={session} />

      <p className="-mt-4 w-full rounded-b-xl border-x border-b bg-white p-2 text-center text-sm text-muted-foreground">
        {t("optionalFields")}
      </p>
    </section>
  );
}
