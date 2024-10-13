import { useQRCode } from "next-qrcode";
import Image from "next/image";
import { Divider } from "~/components/ui/separator";
import { nfcPreferencesStore } from "~/lib/stores/nfcPreferences";
import { type RouterOutputs } from "~/trpc/react";

export const MinimalLogosVariantFront = ({
  cardData,
}: {
  cardData?: RouterOutputs["vCard"]["get"];
}) => {
  const preferences = nfcPreferencesStore((s) => s.preferencesData);
  const colorFront = preferences.cardColorFront ?? "#0F1F20";
  const accentColor = preferences.accentColor ?? "#d8bb24";

  if (preferences.cardVariant !== "basic" || preferences.cardTemplate !== "minimal-logos") {
    return;
  }

  return (
    <section
      className="font-cormorant grid h-[250px] w-full grid-cols-1 place-items-center gap-0 rounded-xl border-4 p-6 text-sm"
      style={{
        borderColor: accentColor,
        background: colorFront,
        color: accentColor,
      }}
    >
      <div className="flex flex-col items-center justify-center">
        <h2 className="text-[84px]/[72px] font-light">DB</h2>

        <header className="flex flex-col items-center gap-0">
          <h3 className="text-2xl">
            {cardData?.contactJSON?.name.first} {cardData?.contactJSON?.name.last}
          </h3>

          <Divider className="my-0" />

          <h3 className="text-2xl">{cardData?.profileHeader}</h3>
        </header>
      </div>
    </section>
  );
};

export const MinimalLogosVariantBack = ({
  urlQREncoder,
}: {
  cardData?: RouterOutputs["vCard"]["get"];
  urlQREncoder?: string;
}) => {
  const preferences = nfcPreferencesStore((s) => s.preferencesData);
  const colorBack = preferences.cardColorBack ?? "#0f1f20";
  const accentColor = preferences.accentColor ?? "#d8bb24";
  const companyLogo = preferences.companyLogoURL;

  const { SVG } = useQRCode();

  if (preferences.cardVariant !== "basic" || preferences.cardTemplate !== "minimal-logos") {
    return;
  }

  return (
    <section
      className="font-cormorant grid h-[250px] w-full grid-cols-1 place-items-center rounded-xl border-4 p-6"
      style={{
        borderColor: accentColor,
        background: colorBack,
        color: accentColor,
      }}
    >
      <article className="flex h-full flex-col items-center justify-center">
        {companyLogo && (
          <Image
            src={companyLogo}
            alt={`company-logo`}
            width={200}
            height={100}
            className="h-[100px] w-[200px] rounded-sm object-cover"
          />
        )}

        {urlQREncoder && preferences.includeQRCode && (
          <SVG
            text={urlQREncoder}
            options={{
              width: 90,
              color: {
                light: colorBack,
                dark: accentColor,
              },
            }}
          />
        )}
      </article>
    </section>
  );
};
