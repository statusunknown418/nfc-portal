import { type Metadata, type ResolvingMetadata, type Viewport } from "next";
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
  const portal = await api.portals.get({ username: username });

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

export async function generateViewport({ params }: Props): Promise<Viewport> {
  const username = decodeURIComponent(params.username);
  const portal = await api.portals.get({ username: username });

  if (!portal.data) {
    return {
      minimumScale: 1,
      maximumScale: 1,
    };
  }

  const isGradient =
    portal.data.theme.colors.background.includes("gradient") ||
    portal.data.theme.colors.background.includes("url");

  return {
    themeColor: !!isGradient ? "rgba(0,0,0,0.5)" : portal.data?.theme.colors.background,
    colorScheme: portal.data?.theme.colorScheme,
  };
}

export default async function UsernamePage({
  params,
  searchParams,
}: {
  searchParams: { ktp?: string; selectedTab?: string; bypassKey?: string };
  params: { username: string };
}) {
  const username = decodeURIComponent(params.username);
  const portal = await api.portals.get({ username: username });

  const tab = searchParams.selectedTab as "contact" | "links";

  if (!portal.data?.hasPageActive && searchParams.bypassKey !== portal.data?.id) {
    return <NotFound />;
  }

  return (
    <PortalContent
      username={username}
      initialData={portal}
      selectedTab={(tab ?? portal.data?.hasContactInfoLocked) ? "links" : "contact"}
    />
  );
}
