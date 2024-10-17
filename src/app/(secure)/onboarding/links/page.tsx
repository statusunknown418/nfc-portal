import { RedirectToSignIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { LinksWrapperRSC } from "~/components/admin/links/links-list/links-wrapper";
import { NewLinkDrawer } from "~/components/admin/links/new-link";
import { AddSocialLinks } from "~/components/admin/links/social-links";

export default async function LinksOnboardingPage() {
  const { sessionClaims } = auth();

  if (!sessionClaims) {
    return <RedirectToSignIn />;
  }

  return (
    <section className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-10">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Añade tus links sociales y profesionales</h1>
        <p className="text-muted-foreground">
          Aquí puedes añadir tus redes sociales y profesionales, cada uno tendrá un aspecto
          personalizado que puedes cambiar en el siguiente paso del onboarding
        </p>
      </header>

      <article className="flex items-center gap-2">
        <AddSocialLinks username={sessionClaims.username} />

        <NewLinkDrawer username={sessionClaims.username} />
      </article>

      <LinksWrapperRSC />
    </section>
  );
}
