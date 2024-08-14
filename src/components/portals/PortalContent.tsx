"use client";

import Link from "next/link";
import { cn } from "~/lib/utils";
import { api, type RouterOutputs } from "~/trpc/react";
import { ContactInfo } from "./ContactInfo";
import { GetYours } from "./GetYours";

export const PortalContent = ({
  initialData,
  username,
}: {
  initialData: RouterOutputs["portals"]["get"];
  username: string;
}) => {
  const { data: portal } = api.portals.get.useQuery({ username }, { initialData });

  if (!portal.data) {
    return;
  }

  return (
    <section
      className={cn("grid h-full grid-cols-1 place-items-center p-4")}
      style={{
        backgroundColor: portal.data.theme.background.background,
        color: portal.data.theme.foregroundColor,
      }}
    >
      <article className="flex h-full w-full max-w-prose flex-col gap-4">
        <h1>{username}</h1>

        <ul>
          {portal.data.links.map((link) => (
            <li key={link.id}>
              {link.position}

              {!!link.url ? (
                <Link
                  href={{
                    pathname: link.url,
                  }}
                >
                  {link.displayText}
                </Link>
              ) : (
                link.displayText
              )}
            </li>
          ))}
        </ul>

        <ContactInfo unlocked={portal.unlocked} data={portal.data?.contactJSON} />

        <GetYours />
      </article>
    </section>
  );
};
