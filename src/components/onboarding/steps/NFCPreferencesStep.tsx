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
      <CardPreferencesForm />

      <CardPreview cardData={data.contactJSON ?? undefined} />
    </section>
  );
};
