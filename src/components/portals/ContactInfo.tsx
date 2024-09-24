"use client";

import { IdCardIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import vCardBuilder from "vcard-creator";
import { cn } from "~/lib/utils";
import { type ContactVCardType, type ThemeType } from "~/server/db/schema";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

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
    <>
      <button
        onClick={handleImport}
        className={cn(
          "mb-4 flex h-14 w-full items-center justify-center gap-2",
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

      <section
        className={cn(
          "relative flex flex-col gap-3 border border-dashed py-4",
          theme.buttons.variant === "pill" && "rounded-lg",
          theme.buttons.variant === "rounded" && "rounded-md",
          theme.buttons.variant === "small-radius" && "rounded-sm",
          theme.buttons.variant === "square" && "rounded-none",
        )}
        style={{
          borderColor: theme.colors.border,
          background: theme.colors.subtle,
        }}
      >
        <article className="flex flex-col gap-1 px-4 text-zinc-50 mix-blend-exclusion">
          <h3 className="text-lg font-semibold">
            {data?.name?.first} {data?.name?.last}
          </h3>

          {data?.jobTitle && <p className="text-sm font-light tracking-tight">{data.jobTitle}</p>}

          {data?.company?.name && (
            <p className="text-sm font-light tracking-tight">{data.company.name}</p>
          )}
        </article>

        {!!data.phoneNumbers?.length && data.phoneNumbers.some((phone) => !!phone.number) && (
          <article className="flex flex-col gap-2 border-b pt-2">
            <p className="px-4 text-sm font-light text-zinc-300 mix-blend-difference">
              Phone number(s)
            </p>

            <ul className="flex w-full flex-col">
              {data.phoneNumbers.map((phone) => (
                <li
                  key={phone.number}
                  className="flex w-full items-center gap-2 border-b px-4 py-2 first:border-t last:border-b-0"
                  style={{
                    background: theme.colors.background,
                  }}
                >
                  <p className="text-xs font-semibold text-blue-600 mix-blend-exclusion">
                    {phone.type}
                  </p>
                  <p className="text-sm font-medium tracking-tight text-zinc-50 mix-blend-exclusion">
                    {phone.number}
                  </p>
                </li>
              ))}
            </ul>
          </article>
        )}

        {!!data.email?.length && (
          <article className="flex flex-col gap-2 border-b pt-2">
            <p className="px-4 text-sm font-light text-zinc-300 mix-blend-difference">Email(s)</p>

            <ul className="flex w-full flex-col">
              {data.email.map((email) => (
                <Link
                  className="flex w-full items-center gap-2 border-b px-4 py-2 first:border-t last:border-b-0"
                  style={{
                    background: theme.colors.background,
                  }}
                  key={email.link}
                  href={{
                    pathname: `mailto:${email.link}`,
                    query: { subject: `Hello ${data.name?.first}!` },
                  }}
                >
                  <p className="text-xs font-semibold text-blue-600 mix-blend-exclusion">
                    {email.type}
                  </p>

                  <p className="text-sm font-medium tracking-tight text-zinc-50 mix-blend-exclusion">
                    {email.link}
                  </p>
                </Link>
              ))}
            </ul>
          </article>
        )}

        {!!data.address?.length && data.address.some((address) => !!address.street) && (
          <article className="flex flex-col gap-2 border-b pt-2">
            <p className="px-4 text-sm font-medium">Address(es)</p>

            <ul className="flex w-full flex-col">
              {data.address.map((address, idx) => (
                <li
                  key={idx}
                  className="flex w-full flex-col gap-0.5 border-b px-4 py-2 first:border-t last:border-b-0"
                  style={{
                    background: theme.colors.background,
                  }}
                >
                  <p className="text-sm tracking-tight">{address.street}</p>
                  <p className="text-sm font-light tracking-tight">{address.region}</p>
                  <p className="text-sm font-light tracking-tight">{address.city}</p>

                  <div className="flex gap-1">
                    <p className="text-sm font-light tracking-tight">{address.postalCode}</p>
                    <p className="text-sm font-light tracking-tight">{address.country}</p>
                  </div>
                </li>
              ))}
            </ul>
          </article>
        )}

        <p></p>
      </section>
    </>
  );
};
