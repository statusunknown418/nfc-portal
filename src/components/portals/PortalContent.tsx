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
  } = api.portals.get.useQuery({ username }, { initialData });

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
      className={cn("grid h-full grid-cols-1 place-items-center overflow-y-auto px-4 pb-28 pt-4")}
      style={{
        backgroundColor: portal.data.theme.background.background,
        color: portal.data.theme.foregroundColor,
      }}
    >
      <article className="flex h-full w-full max-w-prose flex-col gap-4">
        {portal.data.image && (
          <Image
            alt={`${username} profile image`}
            width={256}
            height={256}
            className="rounded-full"
            src={portal.data.image}
          />
        )}
        <h1 className="text-2xl font-bold">{username}</h1>
        <p>{portal.data.bio}</p>

        <ul className="flex flex-col gap-4">
          {portal.data.links.map((link) => (
            <LinkViewer link={link} key={link.id} />
          ))}
        </ul>

        <ContactInfo unlocked={portal.unlocked} data={portal.data?.contactJSON} />

        <GetYours />
      </article>
    </section>
  );
};
