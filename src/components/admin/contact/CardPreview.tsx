"use client";

import Image from "next/image";
import DotPattern from "~/components/magicui/dot-pattern";
import { CardBody, CardContainer, CardItem } from "~/components/aceternity/3d-card";
import { nfcPreferencesStore } from "~/lib/stores/nfcPreferences";
import { basicCardTemplates, cn } from "~/lib/utils";
import { type ContactVCardType } from "~/server/db/schema";

export const CardPreview = ({
  className,
  cardData,
}: {
  className?: string;
  cardData?: ContactVCardType;
}) => {
  const preferences = nfcPreferencesStore((s) => s.preferencesData);

  return (
    <article
      className={cn(
        "relative mt-4 flex min-h-full w-full flex-col items-center justify-center rounded-lg lg:mt-0",
        className,
      )}
    >
      <CardContainer
        className="min-h-full w-full flex-grow"
        containerClassName={cn("min-h-full flex-grow w-full z-10")}
      >
        <CardBody className="group/card flex w-full items-start justify-center">
          <CardItem
            translateZ="100"
            rotateX={15}
            rotateZ={5}
            className={cn(
              "grid max-h-[250px] min-h-[250px] w-[440px] grid-rows-3 rounded-xl border border-muted p-6 text-sm shadow-lg group-hover:shadow-xl md:h-64",
              preferences.cardVariant === "basic" && "bg-primary text-primary-foreground",
              preferences.cardVariant === "custom" ||
                (!!preferences.cardTemplate && "bg-cover bg-center bg-no-repeat"),
            )}
            style={{
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
                  "font-medium text-primary-foreground opacity-0 transition-opacity",
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
                  "font-medium uppercase text-muted-foreground opacity-0 transition-opacity",
                  preferences.showJobTitle && preferences.jobTitleOnFront && "opacity-100",
                )}
              >
                {cardData?.jobTitle}
              </p>

              <p
                className={cn(
                  "text-base opacity-0 mix-blend-difference transition-all",
                  preferences.showName && preferences.nameOnFront && "opacity-100",
                )}
              >
                {cardData?.name.first} {cardData?.name.last}
              </p>
            </article>
          </CardItem>
        </CardBody>
      </CardContainer>

      <DotPattern
        className={cn("z-0 w-full p-1 opacity-70 [mask-image:linear-gradient(to_bottom)]")}
      />
    </article>
  );
};
