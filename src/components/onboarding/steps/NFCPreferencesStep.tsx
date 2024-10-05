"use client";

import { api, type RouterOutputs } from "~/trpc/react";
import { CardPreferencesForm } from "../../admin/CardPreferencesForm";
import { CardPreview } from "../../admin/contact/CardPreview";

export const NFCPreferencesStep = ({
  initialData,
}: {
  initialData: RouterOutputs["vCard"]["get"];
}) => {
  const [data] = api.vCard.get.useSuspenseQuery(undefined, { initialData });

  return (
    <section className="flex h-full flex-col gap-4 lg:flex-row">
      <article className="h-full">
        <header className="mb-6 space-y-1">
          <h2 className="text-2xl font-bold">Customize your business card</h2>

          <p className="text-muted-foreground">
            Improve your personal brand and make it stand out from the crowd.
          </p>
        </header>

        <CardPreferencesForm />
      </article>

      <CardPreview cardData={data.contactJSON ?? undefined} />
    </section>
  );
};
