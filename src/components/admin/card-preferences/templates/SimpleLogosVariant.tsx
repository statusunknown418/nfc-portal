import { useQRCode } from "next-qrcode";
import Image from "next/image";
import { nfcPreferencesStore } from "~/lib/stores/nfcPreferences";
import { cn } from "~/lib/utils";
import { type RouterOutputs } from "~/trpc/react";

export const SimpleLogosVariantFront = ({
  userData,
}: {
  userData?: RouterOutputs["vCard"]["get"];
}) => {
  const preferences = nfcPreferencesStore((s) => s.preferencesData);
  const colorFront = !preferences.cardColorFront ? "#d6d6d6" : preferences.cardColorFront;
  const profilePic = preferences.profileImageUrl ?? userData?.image;
  const accent = !!preferences.accentColor ? preferences.accentColor : "#000000";

  if (preferences.cardVariant !== "basic" || preferences.cardTemplate !== "simple-logos") {
    return;
  }

  return (
    <section
      className="relative grid h-full w-full grid-cols-2"
      style={{
        background: colorFront,
      }}
    >
      <div className="relative flex h-full flex-col justify-end">
        {profilePic && (
          <Image
            src={profilePic}
            alt="front-template-design"
            width={200}
            height={220}
            className="h-[220px] w-[200px] object-cover"
          />
        )}
      </div>

      <div
        className="flex flex-col items-center justify-center pr-6"
        style={{
          color: accent,
        }}
      >
        {preferences.showName && (
          <h2 className="text-[24px]/8 font-bold">
            {userData?.contactJSON?.name.first} {userData?.contactJSON?.name.last}
          </h2>
        )}

        <p className="text-xl">{userData?.profileHeader}</p>
      </div>
    </section>
  );
};

export const SimpleLogosVariantBack = ({
  urlQREncoder,
  userData,
}: {
  urlQREncoder?: string;
  userData?: RouterOutputs["vCard"]["get"];
}) => {
  const preferences = nfcPreferencesStore((s) => s.preferencesData);
  const colorBack = !!preferences.cardColorBack ? preferences.cardColorBack : "#d6d6d6";
  const accent = !!preferences.accentColor ? preferences.accentColor : "#000000";
  const { SVG } = useQRCode();

  if (preferences.cardTemplate !== "simple-logos" || preferences.cardVariant !== "basic") {
    return;
  }

  return (
    <section
      className={cn(
        "relative grid h-full w-full place-items-center gap-1",
        preferences.includeQRCode && "grid-rows-2",
      )}
      style={{
        background: colorBack,
        color: accent,
      }}
    >
      <div className="relative flex w-full flex-col items-center justify-center self-end">
        <article className="flex items-center gap-3">
          {preferences.companyLogoURL && !!preferences.showCompanyLogo && (
            <Image
              src={preferences.companyLogoURL}
              alt={`company-logo`}
              width={50}
              height={50}
              className="h-[50px] w-[50px] rounded-md object-cover"
            />
          )}

          <h2 className="text-4xl font-bold">
            {preferences.showCompanyName && userData?.contactJSON?.company?.name}
          </h2>
        </article>

        <h3 className="text-xl">{preferences.showJobTitle && userData?.contactJSON?.jobTitle}</h3>
      </div>

      <div className="relative flex w-full items-start justify-center">
        {preferences.includeQRCode && !!urlQREncoder && (
          <SVG
            text={urlQREncoder}
            options={{
              width: 90,
              color: {
                light: colorBack ?? "#d6d6d6",
                dark: accent,
              },
            }}
          />
        )}
      </div>
    </section>
  );
};
