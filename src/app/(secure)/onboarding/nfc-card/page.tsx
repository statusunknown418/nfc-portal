import { getTranslations } from "next-intl/server";
import { Cormorant, Instrument_Sans } from "next/font/google";
import { CardPreferencesForm } from "~/components/admin/card-preferences/CardPreferencesForm";
import { CardPreview } from "~/components/admin/contact/CardPreview";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/server";

const InstrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument-sans",
});

const CormorantFont = Cormorant({
  subsets: ["latin"],
  variable: "--font-cormorant",
});

export default async function NFCCardPage() {
  const [data, viewer] = await Promise.all([api.vCard.get(), api.viewer.get()]);
  const t = await getTranslations("admin.onboarding.steps.cardPreferences");

  return (
    <section
      className={cn(
        "relative flex max-h-full flex-grow flex-col gap-4 px-4 lg:flex-row lg:justify-between lg:gap-12 xl:px-0",
        InstrumentSans.variable,
        CormorantFont.variable,
      )}
    >
      <article>
        <header className="mb-6 space-y-1">
          <h2 className="text-2xl font-bold">{t("title")}</h2>

          <p className="text-muted-foreground">{t("description")}</p>
        </header>

        <CardPreferencesForm />
      </article>

      <div className="h-[calc(svh-100px)] md:h-[calc(svh-20rem)]">
        <CardPreview
          cardData={data}
          urlQREncoder={`https://concard.app/${viewer?.username}?ktp=${viewer?.pageHashKey}`}
        />
      </div>
    </section>
  );
}
