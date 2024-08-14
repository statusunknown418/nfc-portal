import { type Metadata, type ResolvingMetadata } from "next";
import { NotFound } from "~/components/portals/NotFound";
import { PortalContent } from "~/components/portals/PortalContent";
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

  if (!portal.data) {
    return <NotFound />;
  }

  return <PortalContent username={username} initialData={portal} />;
}
