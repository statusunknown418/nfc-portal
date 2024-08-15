"use client";

import Link from "next/link";
import { useFrameSync } from "~/lib/hooks/use-frame-sync";
import { cn } from "~/lib/utils";
import { api, type RouterOutputs } from "~/trpc/react";
import { Spinner } from "../shared/Spinner";
import { ContactInfo } from "./ContactInfo";
import { GetYours } from "./GetYours";

export const PortalContent = ({
  initialData,
  username,
}: {
  initialData: RouterOutputs["portals"]["get"];
  username: string;
}) => {
  const {
    data: portal,
    refetch,
    isRefetching,
  } = api.portals.get.useQuery({ username }, { initialData });

  useFrameSync(() => void refetch());

  if (!portal.data) {
    return;
  }

  if (isRefetching) {
    return (
      <section
        className={cn("grid h-full grid-cols-1 place-items-center p-4")}
        style={{
          backgroundColor: portal.data.theme.background.background,
          color: portal.data.theme.foregroundColor,
        }}
      >
        <div className="flex animate-pulse items-center justify-center gap-2 p-4">
          <p className="font-medium">Rebuilding portal</p>
          <Spinner className="text-indigo-500" />
        </div>
      </section>
    );
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
              {link.position} -{" "}
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
