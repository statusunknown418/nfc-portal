import { useQRCode } from "next-qrcode";
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

  if (preferences.cardVariant !== "basic" || preferences.cardTemplate !== "edge-to-edge") {
    return;
  }

  return (
    <section className="grid h-full w-full grid-rows-3 p-6 text-sm">
      <article className="flex justify-between">
        <p
          className={cn(
            "text-base font-semibold tracking-wide text-primary-foreground opacity-0 transition-opacity",
            preferences.showCompanyName && preferences.companyNameOnFront && "opacity-100",
          )}
        >
          {cardData?.contactJSON?.company?.name}
        </p>
      </article>

      <article className="flex items-center justify-center">
        {preferences.showCompanyLogo &&
          preferences.companyLogoOnFront &&
          preferences.companyLogoURL && (
            <Image
              width={100}
              height={100}
              src={preferences.companyLogoURL}
              alt={`company-logo`}
              className="rounded-md object-cover"
            />
          )}
      </article>

      <article className="flex items-center justify-between self-end">
        <p
          className={cn(
            "text-lg font-medium uppercase text-muted-foreground opacity-0 transition-opacity",
            preferences.showJobTitle && preferences.jobTitleOnFront && "opacity-100",
          )}
        >
          {cardData?.contactJSON?.jobTitle}
        </p>

        <p
          className={cn(
            "text-lg opacity-0 mix-blend-difference transition-all",
            preferences.showName && preferences.nameOnFront && "opacity-100",
          )}
        >
          {cardData?.contactJSON?.name.first} {cardData?.contactJSON?.name.last}
        </p>
      </article>
    </section>
  );
};

export const EdgeToEdgeTemplateBack = ({
  cardData,
  urlQREncoder,
}: {
  cardData?: RouterOutputs["vCard"]["get"];
  urlQREncoder?: string;
}) => {
  const preferences = nfcPreferencesStore((s) => s.preferencesData);
  const { SVG } = useQRCode();

  if (preferences.cardVariant !== "basic" || preferences.cardTemplate !== "edge-to-edge") {
    return;
  }

  return (
    <section className="grid h-full w-full grid-rows-3 p-6">
      <article className="flex justify-between">
        <p
          className={cn(
            "text-base font-semibold tracking-wide text-primary-foreground opacity-0 transition-opacity",
            preferences.showCompanyName && !preferences.companyNameOnFront && "opacity-100",
          )}
        >
          {cardData?.contactJSON?.company?.name}
        </p>
      </article>

      <article className="flex items-center justify-center gap-4">
        {preferences.showCompanyLogo &&
          !preferences.companyLogoOnFront &&
          preferences.companyLogoURL && (
            <Image
              width={120}
              height={120}
              src={preferences.companyLogoURL}
              alt={`company-logo`}
              className="rounded-md object-cover"
            />
          )}

        {preferences.includeQRCode && !!urlQREncoder && (
          <SVG
            text={urlQREncoder}
            options={{
              width: 80,
              color: {
                dark: "#000000",
                light: "#ffffff",
              },
            }}
          />
        )}
      </article>

      <article className="flex items-center justify-between self-end">
        <p
          className={cn(
            "text-lg font-medium uppercase text-muted-foreground opacity-0 transition-opacity",
            preferences.showJobTitle && !preferences.jobTitleOnFront && "opacity-100",
          )}
        >
          {cardData?.contactJSON?.jobTitle}
        </p>

        <p
          className={cn(
            "text-lg opacity-0 mix-blend-difference transition-all",
            preferences.showName && !preferences.nameOnFront && "opacity-100",
          )}
        >
          {cardData?.contactJSON?.name.first} {cardData?.contactJSON?.name.last}
        </p>
      </article>
    </section>
  );
};
