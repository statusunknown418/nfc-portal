"use client";

import { ArrowLeftIcon, ArrowRightIcon, ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useFrameSyncReceiver } from "~/lib/hooks/use-frame-sync";
import { cn } from "~/lib/utils";
import { api, type RouterOutputs } from "~/trpc/react";
import { OutlinedSocialIcons } from "../admin/links/social-links/SocialLInksForm";
import { Spinner } from "../shared/Spinner";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";
import { Divider } from "../ui/separator";
import { ContactInfo } from "./ContactInfo";
import { GetYours } from "./GetYours";
import { LinkViewer } from "./LinkViewer";

export const PortalContent = ({
  initialData,
  username,
}: {
  initialData: RouterOutputs["portals"]["get"];
  username: string;
  selectedTab: "links" | "contact";
}) => {
  const utils = api.useUtils();
  const t = useTranslations("admin");

  const {
    data: portal,
    isRefetching,
    refetch,
  } = api.portals.get.useQuery(
    { username: username },
    { initialData, refetchOnWindowFocus: false, refetchOnMount: false },
  );

  useFrameSyncReceiver(() => {
    void Promise.all([utils.viewer.previewPortal.refetch(), refetch()]);
  }) as string;

  if (!portal.data) {
    return (
      <div className="grid h-full grid-cols-1 place-items-center">
        <section className="flex max-w-sm flex-col items-center gap-2 rounded-3xl border bg-white p-6 text-center shadow-lg">
          <ExclamationTriangleIcon className="h-10 w-10 text-destructive" />
          <h2 className="text-2xl font-bold">User not found</h2>
          <p>Try approaching the NFC card again or double check the URL.</p>

          <div className="mt-4 flex w-full flex-col items-center justify-center gap-1">
            <Button asChild variant="secondary_ghost" className="w-full">
              <Link href="/">
                <ArrowLeftIcon />
                Go back home
              </Link>
            </Button>

            <Button asChild className="w-full">
              <Link href="/">
                Go to app
                <ArrowRightIcon />
              </Link>
            </Button>
          </div>
        </section>
      </div>
    );
  }

  if (isRefetching) {
    return (
      <section
        className={cn("grid h-svh grid-cols-1 place-items-center p-4")}
        style={{
          backgroundColor: portal.data.theme.colors.background,
          color: portal.data.theme.colors.foreground,
        }}
      >
        <div className="flex animate-pulse items-center justify-center gap-2 p-4">
          <p className="mix-blend-difference">Rebuilding portal</p>
          <Spinner className="text-indigo-500" />
        </div>
      </section>
    );
  }

  return (
    <section
      className={cn("grid h-full grid-cols-1 place-items-center overflow-y-auto pb-28 sm:pt-4")}
      style={{
        background: portal.data.theme.colors.background,
        color: portal.data.theme.colors.foreground,
      }}
    >
      <article className="flex h-full w-full max-w-[400px] flex-col items-center gap-4 sm:shadow-lg lg:max-w-[580px] xl:rounded-3xl">
        <section
          className={cn(
            "relative z-0 aspect-[4/3] min-h-[330px] w-full overflow-hidden bg-cover bg-center bg-no-repeat md:min-h-[400px] lg:min-h-[580px] lg:rounded-t-xl",
            {
              "rounded-full": portal.data.avatarShape === "circle",
              "rounded-none": portal.data.avatarShape === "square",
            },
          )}
          style={{
            maskImage: "linear-gradient(to bottom, #ffffff 35%, transparent 100%)",
            backgroundImage: `url(${portal.data.image})`,
          }}
        >
          <div
            className="absolute bottom-0 left-0 right-0 h-2/3 w-full"
            style={{
              background: `linear-gradient(to bottom, rgba(0,0,0,0) 30%, rgba(0,0,0,0.6) 80%)`,
            }}
          />
        </section>

        <header
          className={cn(
            "z-10 -mt-20 flex w-full flex-col px-4 text-center lg:-mt-24",
            portal.data.profileHeader && "-mt-28",
          )}
        >
          <h2 className="text-2xl font-extrabold tracking-wide md:text-3xl">{portal.data.name}</h2>

          {portal.data.profileHeader && (
            <p className="px-4 font-semibold">{portal.data.profileHeader}</p>
          )}

          {portal.data.bio && (
            <p className="mt-1 line-clamp-4 px-2 text-sm font-light mix-blend-difference">
              {portal.data.bio}
            </p>
          )}
        </header>

        {!portal.data.hasContactInfoLocked && (
          <ContactInfo
            unlocked={portal.unlocked}
            data={portal.data?.contactJSON}
            theme={portal.data?.theme}
            profilePicture={portal.data.image}
          />
        )}

        <article className="flex w-full max-w-[75%] flex-wrap justify-center gap-4">
          {portal.data.links
            .filter((item) => item.socialType)
            .map((link) => (
              <Link
                target="_blank"
                rel="external"
                className="flex h-8 w-10 items-center justify-center overflow-hidden rounded-md transition-all active:scale-95"
                style={{
                  color: portal.data.theme.colors.border,
                }}
                href={{ pathname: link.url }}
                key={link.id}
              >
                {link.socialType === "twitter" && (
                  <OutlinedSocialIcons.twitter className="size-8" />
                )}
                {link.socialType === "linkedin" && (
                  <OutlinedSocialIcons.linkedin className="size-8" />
                )}
                {link.socialType === "facebook" && (
                  <OutlinedSocialIcons.facebook className="size-8" />
                )}

                {link.socialType === "instagram" && (
                  <OutlinedSocialIcons.instagram className="size-8" />
                )}

                {link.socialType === "github" && <OutlinedSocialIcons.github className="size-8" />}

                {link.socialType === "tiktok" && <OutlinedSocialIcons.tiktok className="size-8" />}

                {link.socialType === "youtube" && (
                  <OutlinedSocialIcons.youtube className="size-8" />
                )}

                {link.socialType === "telegram" && (
                  <OutlinedSocialIcons.telegram className="size-8" />
                )}

                {link.socialType === "patreon" && (
                  <OutlinedSocialIcons.patreon className="size-8" />
                )}

                {link.socialType === "spotify" && (
                  <OutlinedSocialIcons.spotify className="size-8" />
                )}
              </Link>
            ))}
        </article>

        <section className="grid w-full grid-cols-1 gap-4 px-4">
          <section className="flex w-full flex-col gap-2">
            {!portal.data.links.length && (
              <Alert
                className={cn(
                  "border-dashed",
                  portal.data.theme.buttons.variant === "pill" && "rounded-[34px]",
                  portal.data.theme.buttons.variant === "rounded" && "rounded-lg",
                  portal.data.theme.buttons.variant === "square" && "rounded-none",
                  portal.data.theme.buttons.variant === "small-radius" && "rounded-sm",
                )}
                style={{ borderColor: portal.data.theme.colors.border }}
              >
                <AlertTitle className="text-center text-base font-semibold">
                  {t("portal.empty.title")}
                </AlertTitle>
                <AlertDescription className="text-center">
                  {t("portal.empty.description")}
                </AlertDescription>
              </Alert>
            )}

            <Divider className="mb-4 mt-2 text-xs">All other links</Divider>

            {portal.data.links
              .filter((item) => !item.socialType)
              .map((link) => (
                <LinkViewer link={link} key={link.id} styles={portal.data.theme} />
              ))}
          </section>
        </section>

        <GetYours colors={portal.data} />
      </article>
    </section>
  );
};
