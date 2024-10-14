import Image from "next/image";
import { nfcPreferencesStore } from "~/lib/stores/nfcPreferences";
import { cn } from "~/lib/utils";
import { type RouterOutputs } from "~/trpc/react";

export const EdgeToEdgeTemplateFront = ({
  cardData,
}: {
  cardData?: RouterOutputs["vCard"]["get"];
}) => {
  const preferences = nfcPreferencesStore((s) => s.preferencesData);
  const colorFront = !!preferences.cardColorFront ? preferences.cardColorFront : "#0D0D0D";
  const accent = !!preferences.accentColor ? preferences.accentColor : "#000000";

  if (preferences.cardVariant !== "basic" || preferences.cardTemplate !== "edge-to-edge") {
    return;
  }

  return (
    <section
      className={cn(
        "font-instrument-sans grid h-full w-full grid-cols-1 place-items-center gap-0 p-6 text-sm",
      )}
      style={{
        background: colorFront,
        color: accent,
      }}
    >
      <div className="flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold">
          {cardData?.contactJSON?.name.first} {cardData?.contactJSON?.name.last}
        </h2>

        {cardData?.profileHeader && <h3 className="text-xl">{cardData?.profileHeader}</h3>}
      </div>
    </section>
  );
};

export const EdgeToEdgeTemplateBack = ({
  cardData,
}: {
  cardData?: RouterOutputs["vCard"]["get"];
}) => {
  const preferences = nfcPreferencesStore((s) => s.preferencesData);
  const colorFront = !!preferences.cardColorBack ? preferences.cardColorBack : "#0D0D0D";
  const accent = !!preferences.accentColor ? preferences.accentColor : "#000000";

  if (preferences.cardVariant !== "basic" || preferences.cardTemplate !== "edge-to-edge") {
    return;
  }

  return (
    <section
      className="font-instrument-sans grid h-full w-full grid-cols-1 place-items-center p-6"
      style={{
        background: colorFront,
        color: accent,
      }}
    >
      <article className="flex items-center justify-between gap-8">
        <div>
          <h2 className="text-xl font-semibold">{cardData?.contactJSON?.company?.name}</h2>
          <h2 className="text-lg">{cardData?.contactJSON?.jobTitle}</h2>
        </div>

        {!!preferences.showCompanyLogo && preferences.companyLogoURL && (
          <Image
            width={108}
            height={108}
            src={preferences.companyLogoURL}
            alt={`company-logo`}
            className="rounded-md object-cover"
          />
        )}
      </article>
    </section>
  );
};
