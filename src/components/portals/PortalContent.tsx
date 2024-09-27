"use client";

import { useFrameSyncReceiver } from "~/lib/hooks/use-frame-sync";
import { cn } from "~/lib/utils";
import { api, type RouterOutputs } from "~/trpc/react";
import { Spinner } from "../shared/Spinner";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
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
    return;
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
      <article className="flex h-full w-full max-w-[580px] flex-col items-center gap-4 sm:shadow-lg xl:rounded-3xl xl:border xl:border-border/50">
        <section
          className={cn(
            "relative z-0 max-h-[400px] min-h-[300px] w-full max-w-[580px] overflow-hidden bg-cover bg-center bg-no-repeat sm:min-h-[320px] md:min-h-[350px]",
            {
              "rounded-full": portal.data.avatarShape === "circle",
              "rounded-none": portal.data.avatarShape === "square",
            },
          )}
          style={{
            maskImage: "radial-gradient(100% 100% at center top, #ffffff 50%, transparent 90%)",
            backgroundImage: `url(${portal.data.image})`,
          }}
        >
          <div
            className="absolute bottom-0 left-0 right-0 h-2/3 w-full"
            style={{
              background: `linear-gradient(to bottom, rgba(0,0,0,0) 70%, rgba(0,0,0,0.6) 80%)`,
            }}
          />
        </section>

        <header
          className={cn(
            "z-10 -mt-24 flex w-full flex-col px-4 text-center",
            portal.data.profileHeader && "-mt-16",
          )}
        >
          {portal.data.profileHeader && <p className="px-4 text-sm">{portal.data.profileHeader}</p>}

          <h2 className="text-xl font-bold tracking-wide md:text-3xl">{portal.data.name}</h2>

          {portal.data.bio && (
            <p className="mt-1 line-clamp-4 px-2 text-xs mix-blend-difference md:text-sm">
              {portal.data.bio}
            </p>
          )}
        </header>

        <Tabs
          // Note: To avoid adding too many checks I'll just disable eslint here. Don't worry it's actually fine
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          defaultValue={portal.data?.hasContactInfoLocked || !portal.unlocked ? "links" : "contact"}
          className="z-10 w-full px-4"
        >
          <TabsList className="mx-auto mb-6 mt-2 flex h-11 max-w-max rounded-full border px-0.5 mix-blend-difference">
            {!portal.data.hasContactInfoLocked && (
              <TabsTrigger
                value="contact"
                className={cn("h-10 min-w-24 flex-grow rounded-full mix-blend-difference")}
              >
                Contact
              </TabsTrigger>
            )}

            <TabsTrigger
              value="links"
              className={cn("h-10 min-w-24 flex-grow rounded-full mix-blend-difference")}
            >
              Links
            </TabsTrigger>
          </TabsList>

          {!portal.data.hasContactInfoLocked && (
            <TabsContent value="contact">
              <ContactInfo
                unlocked={portal.unlocked}
                data={portal.data?.contactJSON}
                theme={portal.data?.theme}
                profilePicture={portal.data.image}
              />
            </TabsContent>
          )}

          <TabsContent value="links">
            <ul className="flex w-full flex-col gap-2">
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
                    No links added yet
                  </AlertTitle>
                  <AlertDescription className="text-center">
                    If this is your first time here, you can add some links to your profile.
                  </AlertDescription>
                </Alert>
              )}

              {portal.data.links.map((link) => (
                <LinkViewer link={link} key={link.id} buttonStyles={portal.data.theme.buttons} />
              ))}
            </ul>
          </TabsContent>
        </Tabs>

        <GetYours />
      </article>
    </section>
  );
};
