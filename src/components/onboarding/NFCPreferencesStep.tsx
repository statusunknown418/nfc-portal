"use client";

import { useEffect } from "react";
import { cardPreviewsStore } from "~/lib/stores/cardPreviews";
import { type RouterOutputs } from "~/trpc/react";
import { CardPreview } from "../admin/contact/CardPreview";
import { CardPreferencesForm } from "../admin/CardPreferencesForm";

export const NFCPreferencesStep = ({
  initialData,
}: {
  initialData: RouterOutputs["vCard"]["get"];
}) => {
  const setContactPreview = cardPreviewsStore((s) => s.setPreview);

  useEffect(() => {
    if (!initialData?.contactJSON) {
      return;
    }

    setContactPreview(initialData?.contactJSON);
  }, [initialData?.contactJSON, setContactPreview]);

  return (
    <section className="flex h-full flex-col gap-4 lg:flex-row">
      <CardPreferencesForm />

      <CardPreview />
    </section>
  );
};
