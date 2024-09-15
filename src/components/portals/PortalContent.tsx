"use client";

import Image from "next/image";
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
  selectedTab,
}: {
  initialData: RouterOutputs["portals"]["get"];
  username: string;
  selectedTab: "links" | "contact";
}) => {
  const {
    data: portal,
    refetch,
    isRefetching,
  } = api.portals.get.useQuery(
    { username },
    { initialData, refetchOnWindowFocus: false, refetchOnMount: false },
  );

  useFrameSyncReceiver(() => void refetch(), selectedTab) as string;

  if (!portal.data) {
    return;
  }

  if (isRefetching) {
    return (
      <section
        className={cn("grid h-screen grid-cols-1 place-items-center p-4")}
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
      className={cn(
        "grid h-full min-h-screen grid-cols-1 place-items-center overflow-y-auto pb-28 sm:pt-4",
      )}
      style={{
        background: portal.data.theme.colors.background,
        color: portal.data.theme.colors.foreground,
      }}
    >
      <article className="flex h-full w-full max-w-[580px] flex-col items-center gap-4 overflow-hidden xl:rounded-3xl xl:border xl:border-border/50">
        <section
          className={cn(
            "relative z-0 w-full max-w-[580px] overflow-hidden bg-cover bg-center bg-no-repeat",
            {
              "rounded-full": portal.data.avatarShape === "circle",
              "rounded-none": portal.data.avatarShape === "square",
            },
          )}
          style={{
            maskImage: "radial-gradient(100% 100% at center top, #000 60%, transparent 100%)",
            background: portal.data.theme.colors.background,
          }}
        >
          {portal.data.image && (
            <Image
              width={400}
              height={400}
              alt={`${username} profile image`}
              className={cn("max-h-[300px] w-full self-center object-cover md:max-h-[400px]")}
              src={portal.data.image}
            />
          )}

          <div
            className="absolute bottom-0 left-0 right-0 h-1/2 w-full"
            style={{
              background: `linear-gradient(to bottom, rgba(0,0,0,0) 40%, rgba(0,0,0) 80%)`,
            }}
          />
        </section>

        <header className="z-10 -mt-32 mb-2 flex w-full flex-col gap-1 px-4 text-center text-white">
          <h2 className="text-xl font-bold tracking-wide mix-blend-difference md:text-3xl">
            {portal.data.name}
          </h2>
          {(portal.data.profileHeader ?? portal.data.bio) && (
            <div className="flex w-full flex-wrap items-center justify-center gap-1 px-4">
              <p className="text-sm md:text-base">{portal.data.bio}</p>
            </div>
          )}
        </header>

        <Tabs
          className="z-10 w-full px-4"
          // Note: To avoid adding too many checks I'll just disable eslint here. Don't worry it's actually fine
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          defaultValue={portal.data?.hasContactInfoLocked || !portal.unlocked ? "links" : "contact"}
        >
          <TabsList className="mx-auto mb-6 mt-2 flex h-11 min-w-max rounded-full border px-0.5 mix-blend-difference">
            {!portal.data.hasContactInfoLocked && (
              <TabsTrigger
                value="contact"
                className={cn("h-10 flex-grow rounded-full mix-blend-difference")}
              >
                Contact
              </TabsTrigger>
            )}

            <TabsTrigger
              value="links"
              className={cn("h-10 flex-grow rounded-full mix-blend-difference")}
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
              />
            </TabsContent>
          )}

          <TabsContent value="links">
            <ul className="flex w-full flex-col gap-2">
              {!portal.data.links.length && (
                <Alert
                  className="border-dashed"
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
