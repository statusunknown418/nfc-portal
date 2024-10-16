"use client";

import { IdCardIcon } from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";
import { useState } from "react";
import vCardBuilder from "vcard-creator";
import { cn } from "~/lib/utils";
import { type ContactVCardType, type ThemeType } from "~/server/db/schema";
import { api, type RouterOutputs } from "~/trpc/react";
import { Spinner } from "../shared/Spinner";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

export const ContactInfo = ({
  unlocked,
  data,
  profilePicture,
  theme,
  allLinks,
}: {
  unlocked?: boolean;
  data: ContactVCardType | null;
  theme: ThemeType;
  profilePicture: string | null;
  allLinks: RouterOutputs["links"]["all"];
}) => {
  const t = useTranslations("common");
  const [exporting, setExporting] = useState(false);
  const { data: newProfilePicture, isLoading } = api.viewer.makeBase64.useQuery(
    profilePicture ?? "",
    {
      enabled: !!profilePicture,
    },
  );

  if (!unlocked) {
    return (
      <Alert variant="destructive">
        <AlertTitle className="text-center">🔒 {t("contactLocked.title")}</AlertTitle>

        <AlertDescription
          className="text-sm"
          style={{
            color: theme.colors.foreground,
          }}
        >
          {t("contactLocked.description")}
        </AlertDescription>
      </Alert>
    );
  }

  if (!data) {
    return (
      <Alert style={{ background: theme.colors.subtle }}>
        <AlertTitle className="text-center">No se encontró información de contacto</AlertTitle>

        <AlertDescription>Este usuario aún no haa añadido información de contacto</AlertDescription>
      </Alert>
    );
  }

  const handleImport = async () => {
    setExporting(true);
    const vCard = new vCardBuilder();

    vCard.addName(data.name?.last, data.name?.first);
    data.company?.name && vCard.addCompany(data.company?.name, data.company?.department);
    data.jobTitle && vCard.addJobtitle(data.jobTitle);
    data.phoneNumbers?.forEach((phone) => vCard.addPhoneNumber(phone.number, phone.type));
    data.email?.forEach((email) => !!email.link && vCard.addEmail(email.link, email.type));
    data.address?.forEach(
      (address) =>
        address.street &&
        vCard.addAddress(
          "",
          undefined,
          address.street,
          address.city,
          address.region,
          address.postalCode,
          address.country,
          address.type,
        ),
    );

    allLinks
      .filter((link) => !!link.socialType)
      .forEach((link) => {
        if (!link.socialType || !link.url || !link.displayText) return;

        vCard.addSocial(link.url, link.socialType.toUpperCase(), link.displayText);
      });

    allLinks
      .filter((link) => !link.socialType)
      .forEach((link) => {
        if (!link.url || !link.displayText) return;

        vCard.addURL(link.url, "HOME");
      });

    vCard.addNote("---\nPowered by Concard - https://concard.app");
    newProfilePicture && vCard.addPhoto(newProfilePicture, "jpeg");

    const fullVCard = vCard.buildVCard();

    const blob = new Blob([fullVCard], {
      type: "text/vcard",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${data.name?.first ?? "user"}_${data.name?.last ?? "contact"}.vcf`;

    link.click();
    setExporting(false);
  };

  if (!data.name.first && !data.name.last) {
    return (
      <Alert style={{ borderColor: theme.colors.border }}>
        <AlertTitle className="text-center">No contact info added yet</AlertTitle>

        <AlertDescription
          className="text-center"
          style={{
            color: theme.colors.foreground,
          }}
        >
          You can add your contact info from the <strong>Portal customization</strong>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <article className="flex w-full flex-col gap-4">
      <button
        onClick={handleImport}
        className={cn(
          "flex h-14 w-full items-center justify-center gap-3 self-center bg-gradient-to-r px-5 text-sm font-semibold uppercase tracking-tight",
          theme.buttons.variant === "pill" && "rounded-[34px]",
          theme.buttons.variant === "rounded" && "rounded-lg",
          theme.buttons.variant === "square" && "rounded-none",
          theme.buttons.variant === "small-radius" && "rounded-md",
        )}
        style={{
          color: theme.buttons.saveContactButton.textColor,
          background: theme.buttons.saveContactButton.background,
          border: `1px ${theme.buttons.saveContactButton.borderStyle} ${theme.buttons.saveContactButton.borderColor}`,
          fontStyle: theme.buttons.fontStyle,
          fontWeight: theme.buttons.fontWeight,
        }}
      >
        {isLoading || exporting ? (
          <Spinner className="text-inherit" />
        ) : (
          <IdCardIcon className="size-[22px]" />
        )}
        {t("importContact")}
      </button>
    </article>
  );
};
