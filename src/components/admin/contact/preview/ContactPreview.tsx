"use client";

import { Spinner } from "@phosphor-icons/react";
import { Share2Icon } from "@radix-ui/react-icons";
import Image from "next/image";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { api, type RouterOutputs } from "~/trpc/react";

export const ContactPreview = ({ initialData }: { initialData: RouterOutputs["vCard"]["get"] }) => {
  const { data } = api.vCard.get.useQuery({ includeImagePalette: true }, { initialData });

  const { data: links, isLoading } = api.links.all.useQuery();

  return (
    <section className="flex h-max max-h-[900px] w-full max-w-lg flex-col justify-self-center rounded-xl shadow-lg">
      <article
        className={cn(
          "relative grid w-full max-w-lg grid-cols-1 gap-4 self-center rounded-t-xl p-4 backdrop-blur-md",
        )}
        style={{
          background: `color-mix(in srgb, ${data.dominantColor}, black 70%)`,
        }}
      >
        <section className="fixed left-0 top-0 -z-10 h-full w-full overflow-hidden">
          {data.image && (
            <Image
              fill
              src={data.image}
              alt="backdrop"
              className="h-full w-full rounded-xl object-cover opacity-70 blur-3xl"
            />
          )}
        </section>

        <header className="flex justify-between">
          <div />

          <Button variant="iOSGhost" size="icon">
            <Share2Icon className="size-7" />
          </Button>
        </header>

        {data?.image && (
          <Image
            src={data.image}
            width={250}
            height={250}
            alt="User profile pic"
            className="h-[250px] w-[250px] justify-self-center rounded-full object-cover"
          />
        )}

        <section className="flex flex-col items-center gap-2 px-5">
          <h3 className="text-base font-medium uppercase text-neutral-300">
            {data.contactJSON?.jobTitle} &middot; {data.contactJSON?.company?.name}
          </h3>

          <h2 className="text-4xl font-light text-white">
            {data.contactJSON?.name?.first} {data.contactJSON?.name?.last}
          </h2>
        </section>

        <section className="text-white">
          <p>Email</p>
        </section>
      </article>

      <article className="flex w-full max-w-lg flex-col gap-4 self-center overflow-y-auto rounded-b-xl bg-neutral-200 p-4">
        <section className="flex flex-col rounded-md bg-white px-5 py-2">
          {data.contactJSON?.phoneNumbers?.map((phoneNumber) => (
            <div
              key={`${phoneNumber.type}-${phoneNumber.number}`}
              className="border-b border-border/40 py-3 last:border-b-0"
            >
              <p>Phone</p>

              <p className="w-full text-lg text-indigo-500">{phoneNumber.number}</p>
            </div>
          ))}
        </section>

        <section className="flex flex-col rounded-md bg-white px-5 py-2">
          {data.contactJSON?.email?.map((email) => (
            <div
              key={`${email.type}-${email.link}`}
              className="border-b border-border/40 py-3 last:border-b-0"
            >
              <p>Email</p>

              <p className="w-full text-lg text-indigo-500">{email.link}</p>
            </div>
          ))}
        </section>

        <section className="flex w-full flex-col break-words rounded-md bg-white px-5 py-2">
          {isLoading && <Spinner className="size-6 animate-spin self-center" />}
          {links
            ?.filter((link) => !link.socialType)
            .map((link) => (
              <div key={link.id} className="border-b border-border/40 py-3 last:border-b-0">
                <p>{link.displayText}</p>

                <p className="text-lg text-indigo-500">{link.url}</p>
              </div>
            ))}
        </section>

        <section className="flex flex-col rounded-md bg-white px-5 py-2">
          {data.contactJSON?.address?.map((address) => (
            <div
              key={`${address.extended}-${address.type}`}
              className="border-b border-border/40 py-3 last:border-b-0"
            >
              <p>Address</p>

              <p className="mt-2 flex max-w-[70%] flex-col text-lg/5">
                <span>{address.street}</span>
                <span>
                  {address.city} {address.postalCode}
                </span>
                <span>{address.country}</span>
              </p>
            </div>
          ))}
        </section>

        <section className="flex w-full flex-col break-words rounded-md bg-white px-5 py-2">
          {isLoading && <Spinner className="size-6 animate-spin self-center" />}
          {links
            ?.filter((link) => !!link.socialType)
            .map((link) => (
              <div key={link.id} className="border-b border-border/40 py-3 last:border-b-0">
                <p>{link.socialType?.toLocaleUpperCase()}</p>

                <p className="text-lg text-indigo-500">{link.url}</p>
              </div>
            ))}
        </section>
      </article>
    </section>
  );
};
