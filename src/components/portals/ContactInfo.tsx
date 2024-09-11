"use client";

import { IdCardIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import vCardBuilder from "vcard-creator";
import { type ContactVCardType, type ThemeType } from "~/server/db/schema";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

export const ContactInfo = ({
  unlocked,
  data,
  theme,
}: {
  unlocked?: boolean;
  data: ContactVCardType | null;
  theme: ThemeType;
}) => {
  if (!unlocked) {
    return (
      <Card className="relative border-dashed border-destructive py-4">
        <section className="absolute inset-0 flex h-full w-full flex-col items-center justify-center gap-2 rounded-lg bg-destructive/5 p-4 text-center backdrop-blur backdrop-filter">
          <h3 className="font-semibold">🔒 Contact info not visible</h3>

          <p className="text-sm">
            This will be automatically unlocked when the owner&apos;s card is approached to your
            phone.
          </p>
        </section>

        <CardHeader>
          <CardTitle />
        </CardHeader>

        <CardContent />
      </Card>
    );
  }

  if (!data) {
    return (
      <Card style={{ background: theme.colors.subtle }}>
        <CardContent>
          <CardHeader>
            <CardTitle>No contact info found</CardTitle>
            <CardDescription>
              The page owner hasn&apos;t added any contact info yet.
            </CardDescription>
          </CardHeader>
        </CardContent>
      </Card>
    );
  }

  const handleImport = () => {
    const vCard = new vCardBuilder();
    vCard.addName(data.name?.last, data.name?.first);
    data.company?.name && vCard.addCompany(data.company?.name, data.company?.department);
    data.jobTitle && vCard.addJobtitle(data.jobTitle);
    data.phoneNumbers?.forEach((phone) => vCard.addPhoneNumber(phone.number, phone.type));
    data.email?.forEach((email) => vCard.addEmail(email.link, email.type));
    data.address?.forEach((address) =>
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

    const blob = new Blob([vCard.buildVCard()], {
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
      <Alert className="border-dashed" style={{ borderColor: theme.colors.border }}>
        <AlertTitle className="text-center text-base font-semibold">
          No contact info added yet
        </AlertTitle>
        <AlertDescription className="text-center">
          You can add your contact info from the <strong>Portal customization</strong>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      <Button
        onClick={handleImport}
        size="lg"
        className="mb-4 w-full"
        style={{
          background: theme.buttons.background,
          color: theme.buttons.textColor,
        }}
      >
        <IdCardIcon className="h-5 w-5" />
        Import contact
      </Button>

      <section
        className="flex flex-col gap-3 rounded-lg border border-dashed py-4 shadow-lg"
        style={{ borderColor: theme.colors.border, background: theme.colors.subtle }}
      >
        <article className="flex flex-col gap-1 px-4">
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
            <p className="px-4 text-sm font-medium">Phone number(s)</p>

            <ul className="flex w-full flex-col">
              {data.phoneNumbers.map((phone) => (
                <li
                  key={phone.number}
                  className="flex w-full items-center gap-2 border-b bg-background py-2 first:border-t last:border-b-0"
                >
                  <p className="ml-4 text-xs font-semibold text-blue-600">{phone.type}</p>
                  <p className="pr-4 text-sm font-light tracking-tight">{phone.number}</p>
                </li>
              ))}
            </ul>
          </article>
        )}

        {!!data.email?.length && (
          <article className="flex flex-col gap-2 border-b pt-2">
            <p className="px-4 text-sm font-medium">Email(s)</p>

            <ul className="flex w-full flex-col">
              {data.email.map((email) => (
                <Link
                  className="flex w-full items-center gap-2 border-b bg-background px-4 py-2 first:border-t last:border-b-0"
                  key={email.link}
                  href={{
                    pathname: `mailto:${email.link}`,
                    query: { subject: `Hello ${data.name?.first}!` },
                  }}
                >
                  <p className="text-sm font-light tracking-tight">{email.link}</p>
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
                  className="flex w-full flex-col gap-0.5 border-b bg-background px-4 py-2 first:border-t last:border-b-0"
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
