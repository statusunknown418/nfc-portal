import { getTranslations } from "next-intl/server";
import { CardPreferencesForm } from "~/components/admin/CardPreferencesForm";
import { CardPreview } from "~/components/admin/contact/CardPreview";
import { api } from "~/trpc/server";

export default async function NFCCardPage() {
  const [data, viewer] = await Promise.all([api.vCard.get(), api.viewer.get()]);
  const t = await getTranslations("admin.onboarding.steps.cardPreferences");

  return (
    <section className="flex max-h-full flex-grow flex-col gap-4 lg:flex-row lg:justify-between lg:gap-12">
      <article className="flex-grow">
        <header className="mb-6 space-y-1">
          <h2 className="text-2xl font-bold">{t("title")}</h2>

          <p className="text-muted-foreground">{t("description")}</p>
        </header>

        <CardPreferencesForm />
      </article>

      <div className="h-[calc(svh-100px)] md:h-[calc(svh-20rem)]">
        <CardPreview
          cardData={data?.contactJSON ?? undefined}
          urlQREncoder={`https://concard.app/${viewer?.username}?ktp=${viewer?.pageHashKey}`}
        />
      </div>
    </section>
  );
}
