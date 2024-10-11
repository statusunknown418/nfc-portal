"use client";

import Image from "next/image";
import DotPattern from "~/components/magicui/dot-pattern";
import { CardBody, CardContainer, CardItem } from "~/components/aceternity/3d-card";
import { nfcPreferencesStore } from "~/lib/stores/nfcPreferences";
import { basicCardTemplates, cn } from "~/lib/utils";
import { type ContactVCardType } from "~/server/db/schema";
import { useQRCode } from "next-qrcode";

export const CardPreview = ({
  className,
  cardData,
  urlQREncoder,
}: {
  className?: string;
  cardData?: ContactVCardType;
  urlQREncoder?: string;
}) => {
  return (
    <article
      className={cn(
        "relative flex h-full w-full flex-col items-center justify-center rounded-lg lg:mt-0",
        className,
      )}
    >
      <p>Front</p>
      <CardContainer className="w-full" containerClassName={cn("w-full z-10")}>
        <CardBody className="group/card flex w-full flex-col items-start justify-center gap-2">
          <CardPreviewFront cardData={cardData} />
        </CardBody>
      </CardContainer>

      <p>Back</p>
      <CardContainer className="w-full" containerClassName={cn("w-full z-10")}>
        <CardBody className="group/card2 flex w-full flex-col items-start justify-center gap-2">
          <CardPreviewBack cardData={cardData} urlQREncoder={urlQREncoder} />
        </CardBody>
      </CardContainer>

      <DotPattern
        className={cn("z-0 w-full p-1 opacity-70 [mask-image:linear-gradient(to_bottom)]")}
      />
    </article>
  );
};

const CardPreviewFront = ({ cardData }: { cardData?: ContactVCardType }) => {
  const preferences = nfcPreferencesStore((s) => s.preferencesData);

  return (
    <CardItem
      translateZ={100}
      rotateX={15}
      rotateZ={5}
      className={cn(
        "grid h-[250px] w-[440px] grid-rows-3 rounded-xl p-6 text-sm shadow-xl group-hover:shadow-xl",
        preferences.cardVariant === "basic" && "bg-primary text-primary-foreground",
        !preferences.cardImageFront && "border bg-primary",
      )}
      style={{
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundImage:
          preferences.cardVariant === "custom"
            ? `url(${preferences.cardImageFront})`
            : !!preferences.cardTemplate
              ? `url(${basicCardTemplates.find((t) => t.value === preferences.cardTemplate)?.front})`
              : undefined,
      }}
    >
      <article className="flex justify-between">
        <p
          className={cn(
            "text-base font-semibold tracking-wide text-primary-foreground opacity-0 transition-opacity",
            preferences.showCompanyName && preferences.companyNameOnFront && "opacity-100",
          )}
        >
          {cardData?.company?.name}
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
          {cardData?.jobTitle}
        </p>

        <p
          className={cn(
            "text-lg opacity-0 mix-blend-difference transition-all",
            preferences.showName && preferences.nameOnFront && "opacity-100",
          )}
        >
          {cardData?.name.first} {cardData?.name.last}
        </p>
      </article>
    </CardItem>
  );
};

const CardPreviewBack = ({
  cardData,
  urlQREncoder,
}: {
  cardData?: ContactVCardType;
  urlQREncoder?: string;
}) => {
  const preferences = nfcPreferencesStore((s) => s.preferencesData);
  const { SVG } = useQRCode();

  return (
    <CardItem
      translateZ={100}
      rotateX={15}
      rotateZ={5}
      className={cn(
        "grid h-[250px] w-[440px] grid-rows-3 rounded-xl p-6 text-sm shadow-xl group-hover:shadow-xl",
        preferences.cardVariant === "basic" && "bg-primary text-primary-foreground",
        !preferences.cardImageBack && "border bg-primary",
      )}
      style={{
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundImage:
          preferences.cardVariant === "custom"
            ? `url(${preferences.cardImageBack})`
            : !!preferences.cardTemplate
              ? `url(${basicCardTemplates.find((t) => t.value === preferences.cardTemplate)?.back})`
              : undefined,
      }}
    >
      <article className="flex justify-between">
        <p
          className={cn(
            "text-base font-semibold tracking-wide text-primary-foreground opacity-0 transition-opacity",
            preferences.showCompanyName && !preferences.companyNameOnFront && "opacity-100",
          )}
        >
          {cardData?.company?.name}
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
          {cardData?.jobTitle}
        </p>

        <p
          className={cn(
            "text-lg opacity-0 mix-blend-difference transition-all",
            preferences.showName && !preferences.nameOnFront && "opacity-100",
          )}
        >
          {cardData?.name.first} {cardData?.name.last}
        </p>
      </article>
    </CardItem>
  );
};
