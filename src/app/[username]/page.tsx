import { type Metadata, type ResolvingMetadata } from "next";
import { cookies } from "next/headers";
import { z } from "zod";
import { ContactInfo } from "~/components/portals/ContactInfo";
import { GetYours } from "~/components/portals/GetYours";
import { NotFound } from "~/components/portals/NotFound";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/server";

type Props = {
  params: { username: string };
  searchParams: Record<string, string | string[] | undefined>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const username = decodeURIComponent(params.username);
  const portal = await api.portals.get({ username });

  const previousImages = (await parent).openGraph?.images ?? [];

  return {
    title: portal.data?.metaTitle ?? `${username} - NFC Portal`,
    description: portal.data?.metaDescription ?? "Custom pages for your NFC business card",
    openGraph: {
      images: [
        portal.data?.image ?? {
          url: "https://nfc-portal.vercel.app/opengraph-image.png",
        },
        ...previousImages,
      ],
    },
  };
}

export default async function UsernamePage({
  params,
}: {
  searchParams: { ktp?: string };
  params: { username: string };
}) {
  const username = decodeURIComponent(params.username);
  const portal = await api.portals.get({ username });
  const shouldShowJoin = z.coerce.boolean().parse(cookies().get("nfc-portal-join-page")?.value);

  if (!portal.data) {
    return <NotFound />;
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

        <ContactInfo unlocked={portal.unlocked} data={portal.data?.contactJSON} />

        <GetYours shouldShow={!shouldShowJoin} />
      </article>
    </section>
  );
}
