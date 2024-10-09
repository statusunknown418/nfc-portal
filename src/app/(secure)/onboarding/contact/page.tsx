import { RedirectToSignUp } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { ContactDataForm } from "~/components/admin/contact/contact-data/ContactDataForm";
import { api } from "~/trpc/server";

export default async function ContactPage() {
  const contact = await api.vCard.get();
  const clerk = auth();
  const session = clerk.sessionClaims;

  if (!session?.username) {
    return <RedirectToSignUp />;
  }

  return (
    <section className="flex flex-col items-center justify-center gap-4">
      <article>
        <h3 className="text-2xl font-semibold tracking-wide">Contact information</h3>
        <p className="mt-1 text-muted-foreground">
          Fill in your public contact information, this is what every person you give your card to
          will see, additionally it is possible to hide it from your public page if needed.
        </p>
      </article>

      <ContactDataForm initialData={contact} user={session} className="w-full px-0 pb-0" />
    </section>
  );
}
