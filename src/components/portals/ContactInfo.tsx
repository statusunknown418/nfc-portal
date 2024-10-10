"use client";

import { CellTower, Envelope, Mailbox, PhoneCall } from "@phosphor-icons/react";
import { IdCardIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import vCardBuilder from "vcard-creator";
import { cn, newShade } from "~/lib/utils";
import { type ContactVCardType, type ThemeType } from "~/server/db/schema";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";

export const ContactInfo = ({
  unlocked,
  data,
  profilePicture,
  theme,
}: {
  unlocked?: boolean;
  data: ContactVCardType | null;
  theme: ThemeType;
  profilePicture: string | null;
}) => {
  if (!unlocked) {
    return (
      <Alert variant="destructive">
        <AlertTitle className="text-center">🔒 Contact info not visible</AlertTitle>

        <AlertDescription className="text-sm">
          This will be automatically unlocked when the owner&apos;s card is approached to your
          phone.
        </AlertDescription>
      </Alert>
    );
  }

  if (!data) {
    return (
      <Alert style={{ background: theme.colors.subtle }}>
        <AlertTitle className="text-center">No contact info found</AlertTitle>

        <AlertDescription>The page owner hasn&apos;t added any contact info yet.</AlertDescription>
      </Alert>
    );
  }

  const handleImport = async () => {
    const vCard = new vCardBuilder();

    vCard.addName(data.name?.last, data.name?.first);
    data.company?.name && vCard.addCompany(data.company?.name, data.company?.department);
    data.jobTitle && vCard.addJobtitle(data.jobTitle);
    data.phoneNumbers?.forEach((phone) => vCard.addPhoneNumber(phone.number, phone.type));
    data.email?.forEach((email) => vCard.addEmail(email.link, email.type));
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
    vCard.addNote("Created with https://concard.app");

    const fullVCard = vCard.buildVCard();

    const blob = new Blob([fullVCard], {
      type: "text/vcard",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${data.name?.first ?? "user"}_${data.name?.last ?? "contact"}.vcf`;

    link.click();
  };

  if (!data.name.first && !data.name.last) {
    return (
      <Alert style={{ borderColor: theme.colors.border }}>
        <AlertTitle className="text-center">No contact info added yet</AlertTitle>

        <AlertDescription className="text-center">
          You can add your contact info from the <strong>Portal customization</strong>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <article className="flex flex-col gap-4">
      <button
        onClick={handleImport}
        className={cn(
          "flex h-14 w-full items-center justify-center gap-2 rounded-md font-medium",
          // theme.buttons.variant === "pill" && "rounded-[34px]",
          // theme.buttons.variant === "rounded" && "rounded-lg",
          // theme.buttons.variant === "square" && "rounded-none",
          // theme.buttons.variant === "small-radius" && "rounded-sm",
        )}
        style={{
          border: `1px ${theme.buttons.borderStyle} ${theme.colors.subtle}`,
          color: theme.colors.subtle,
        }}
      >
        <IdCardIcon className="h-5 w-5" />
        Import contact
      </button>
    </article>
  );
};
