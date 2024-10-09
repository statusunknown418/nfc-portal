"use client";

import { CellTower, Envelope, Mailbox, PhoneCall } from "@phosphor-icons/react";
import { IdCardIcon } from "@radix-ui/react-icons";
import vCardBuilder from "vcard-creator";
import { cn } from "~/lib/utils";
import { type ContactVCardType, type ThemeType } from "~/server/db/schema";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";
import Link from "next/link";

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
          "flex h-14 w-full items-center justify-center gap-2",
          theme.buttons.variant === "pill" && "rounded-[34px]",
          theme.buttons.variant === "rounded" && "rounded-lg",
          theme.buttons.variant === "square" && "rounded-none",
          theme.buttons.variant === "small-radius" && "rounded-sm",
        )}
        style={{
          background: theme.buttons.background,
          color: theme.buttons.textColor,
          fontWeight: theme.buttons.fontWeight,
          fontStyle: theme.buttons.fontStyle,
          border: `1px ${theme.buttons.borderStyle} ${theme.buttons.borderColor}`,
        }}
      >
        <IdCardIcon className="h-5 w-5" />
        Import contact
      </button>

      <section className="flex justify-between gap-1">
        <article className="flex gap-1">
          <Link
            href={`https://wa.me/${data.phoneNumbers?.find((p) => p.type === "PREF")?.number}`}
            target="_blank"
            rel="external"
          >
            <Button size="iconXl" className="rounded-full" asChild>
              <div>
                <PhoneCall size={28} />
                <span className="sr-only">Personal phone</span>
              </div>
            </Button>

            <p className="font-xs text-sm">Personal</p>
          </Link>

          <Link
            rel="external"
            href={`https://wa.me/${data.phoneNumbers?.find((p) => p.type === "WORK")?.number}`}
            className="flex flex-col items-center gap-1"
            target="_blank"
          >
            <Button size="iconXl" className="rounded-full" asChild>
              <div>
                <CellTower size={28} />
                <span className="sr-only">Work phone</span>
              </div>
            </Button>

            <p className="font-xs text-sm">Work</p>
          </Link>
        </article>

        <article className="flex gap-1">
          <Link
            rel="external"
            href={`mailto:${data.email?.find((e) => e.type === "WORK")?.link}`}
            className="flex flex-col items-center gap-1"
            target="_blank"
          >
            <Button size="iconXl" className="rounded-full" asChild>
              <div>
                <Envelope size={28} />
                <span className="sr-only">Work email</span>
              </div>
            </Button>

            <p className="font-xs text-sm">Personal</p>
          </Link>

          <Link
            rel="external"
            href={`mailto:${data.email?.find((e) => e.type === "PREF")?.link}`}
            className="flex flex-col items-center gap-1"
            target="_blank"
          >
            <Button size="iconXl" className="rounded-full" asChild>
              <div>
                <Mailbox size={28} />
                <span className="sr-only">Personal email</span>
              </div>
            </Button>

            <p className="font-xs text-sm">Work</p>
          </Link>
        </article>
      </section>
    </article>
  );
};
