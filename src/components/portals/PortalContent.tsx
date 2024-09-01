"use client";

import { useFrameSyncReceiver } from "~/lib/hooks/use-frame-sync";
import { cn } from "~/lib/utils";
import { api, type RouterOutputs } from "~/trpc/react";
import { Spinner } from "../shared/Spinner";
import { ContactInfo } from "./ContactInfo";
import { GetYours } from "./GetYours";
import { LinkViewer } from "./LinkViewer";
import Image from "next/image";

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
  } = api.portals.get.useQuery({ username }, { initialData, refetchOnWindowFocus: false });

  useFrameSyncReceiver(() => void refetch());

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
      className={cn("grid h-full grid-cols-1 place-items-center overflow-y-auto px-4 pb-28 pt-10")}
      style={{
        background: portal.data.theme.background.background,
        color: portal.data.theme.foregroundColor,
      }}
    >
      <article className="flex h-full w-full max-w-prose flex-col items-center gap-4">
        {portal.data.image && (
          <Image
            alt={`${username} profile image`}
            width={100}
            height={100}
            className={cn({
              "rounded-full": portal.data.avatarShape === "circle",
              "rounded-none": portal.data.avatarShape === "square",
              "rounded-lg": portal.data.avatarShape === "rounded",
            })}
            src={portal.data.image}
          />
        )}

        <header className="w-full space-y-1 text-center">
          <h1 className="text-lg font-semibold">
            {username} &middot; {portal.data.name}
          </h1>

          <h2 className="text-base">{portal.data.profileHeader}</h2>
          <p className="text-sm">{portal.data.bio}</p>
        </header>

        <ul className="flex w-full flex-col gap-2">
          {portal.data.links.map((link) => (
            <LinkViewer link={link} key={link.id} buttonStyles={portal.data.theme.buttons} />
          ))}
        </ul>

        <ContactInfo unlocked={portal.unlocked} data={portal.data?.contactJSON} />

        <GetYours />
      </article>
    </section>
  );
};
