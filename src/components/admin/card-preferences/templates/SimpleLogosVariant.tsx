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
        className="flex flex-col items-end justify-center pr-6 mix-blend-difference"
        style={{
          color: "",
        }}
      >
        <h2 className="text-[24px]/8 font-bold">
          {userData?.contactJSON?.name.first} {userData?.contactJSON?.name.last}
        </h2>

        <p className="text-lg">{userData?.profileHeader}</p>
      </div>
    </section>
  );
};

export const SimpleLogosVariantBack = ({
  urlQREncoder,
}: {
  urlQREncoder?: string;
  userData?: RouterOutputs["vCard"]["get"];
}) => {
  const preferences = nfcPreferencesStore((s) => s.preferencesData);
  const colorBack = !!preferences.cardColorBack ? preferences.cardColorBack : "#d6d6d6";
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
      }}
    >
      <div className="relative mt-auto flex w-full items-end justify-center gap-2">
        {preferences.companyLogoURL && !!preferences.showCompanyLogo && (
          <Image
            src={preferences.companyLogoURL}
            alt={`company-logo`}
            width={200}
            height={100}
            className="h-[100px] w-[200px] rounded-md object-cover"
          />
        )}
      </div>

      <div className="relative flex w-full items-start justify-center">
        {preferences.includeQRCode && !!urlQREncoder && (
          <SVG
            text={urlQREncoder}
            options={{
              width: 90,
              color: {
                light: colorBack ?? "#d6d6d6",
              },
            }}
          />
        )}
      </div>
    </section>
  );
};
