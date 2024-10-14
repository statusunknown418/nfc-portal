"use client";

import { CardBody, CardContainer, CardItem } from "~/components/aceternity/3d-card";
import DotPattern from "~/components/magicui/dot-pattern";
import { nfcPreferencesStore } from "~/lib/stores/nfcPreferences";
import { cn } from "~/lib/utils";
import { api, type RouterOutputs } from "~/trpc/react";
import {
  EdgeToEdgeTemplateBack,
  EdgeToEdgeTemplateFront,
} from "../card-preferences/templates/EdgeToEdgeVariant";
import {
  SimpleLogosVariantBack,
  SimpleLogosVariantFront,
} from "../card-preferences/templates/SimpleLogosVariant";
import { useTranslations } from "next-intl";
import {
  MinimalLogosVariantBack,
  MinimalLogosVariantFront,
} from "../card-preferences/templates/MinimalLogosVariant";

export const CardPreview = ({
  className,
  cardData,
  urlQREncoder,
}: {
  className?: string;
  cardData?: RouterOutputs["vCard"]["get"];
  urlQREncoder?: string;
}) => {
  const preferences = nfcPreferencesStore((s) => s.preferencesData);
  const t = useTranslations("admin");
  const { data } = api.vCard.get.useQuery(undefined, { initialData: cardData });

  return (
    <article
      className={cn(
        "relative flex h-full w-full flex-col items-center justify-center gap-10 rounded-lg lg:mt-0",
        className,
      )}
    >
      <section className="z-10 flex w-full flex-col items-center gap-2">
        <p className="font-medium uppercase text-muted-foreground">
          {t("onboarding.steps.cardPreferences.details.front")}
        </p>

        <CardContainer className="w-full" containerClassName={cn("w-full z-10")}>
          <CardBody className="group/card flex h-max w-full flex-col items-center justify-center gap-2">
            <CardItem
              translateZ={100}
              rotateX={15}
              rotateZ={5}
              className={cn(
                "h-[250px] w-[440px] overflow-hidden rounded-xl text-sm shadow-xl group-hover:shadow-xl",
                preferences.cardVariant === "basic" && "bg-primary text-primary-foreground",
                !preferences.cardImageFront &&
                  preferences.cardVariant === "custom" &&
                  "border bg-primary",
              )}
              style={{
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundImage:
                  preferences.cardVariant === "custom"
                    ? `url(${preferences.cardImageFront})`
                    : !!preferences.cardTemplate
                      ? preferences.cardColorFront
                      : undefined,
              }}
            >
              <>
                <SimpleLogosVariantFront userData={data} />
                <EdgeToEdgeTemplateFront cardData={data} />
                <MinimalLogosVariantFront cardData={data} />
              </>
            </CardItem>
          </CardBody>
        </CardContainer>
      </section>

      <section className="z-10 flex w-full flex-col items-center gap-2">
        <p className="font-medium uppercase text-muted-foreground">
          {t("onboarding.steps.cardPreferences.details.back")}
        </p>

        <CardContainer className="w-full" containerClassName={cn("w-full")}>
          <CardBody className="group/card-back flex h-max w-full flex-col items-center justify-center gap-2">
            <CardItem
              translateZ={100}
              rotateX={15}
              rotateZ={5}
              className={cn(
                "grid h-[250px] w-[440px] overflow-hidden rounded-xl text-sm shadow-xl group-hover:shadow-xl",
                preferences.cardVariant === "basic" && "bg-primary text-primary-foreground",
                !preferences.cardImageBack &&
                  preferences.cardVariant === "custom" &&
                  "border bg-primary",
              )}
              style={{
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
              }}
            >
              <>
                <SimpleLogosVariantBack userData={data} urlQREncoder={urlQREncoder} />
                <EdgeToEdgeTemplateBack cardData={data} />
                <MinimalLogosVariantBack cardData={data} urlQREncoder={urlQREncoder} />
              </>
            </CardItem>
          </CardBody>
        </CardContainer>
      </section>

      <DotPattern
        className={cn("z-0 w-full p-1 opacity-70 [mask-image:linear-gradient(to_bottom)]")}
      />
    </article>
  );
};
