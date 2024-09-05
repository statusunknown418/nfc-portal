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
        className={cn("grid h-screen grid-cols-1 place-items-center p-4")}
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
      className={cn(
        "grid min-h-screen grid-cols-1 place-items-center overflow-y-auto px-4 pb-28 pt-10",
      )}
      style={{
        background: portal.data.theme.background.background,
        color: portal.data.theme.foregroundColor,
      }}
    >
      <article className="flex h-full w-full max-w-prose flex-col items-center gap-4">
        {portal.data.image && (
          <Image
            alt={`${username} profile image`}
            width={80}
            height={80}
            className={cn("h-[80px] w-[80px] object-cover", {
              "rounded-full": portal.data.avatarShape === "circle",
              "rounded-none": portal.data.avatarShape === "square",
              "rounded-lg": portal.data.avatarShape === "rounded",
            })}
            src={portal.data.image}
          />
        )}

        <header className="flex w-full flex-col gap-0.5 text-center">
          <h1 className="text-sm">{username}</h1>
          <h2 className="text-base font-semibold">{portal.data.name}</h2>

          <div className="my-3 flex w-full flex-wrap items-center justify-center gap-1 border-y py-2.5">
            <h2 className="text-base">{portal.data.profileHeader}</h2>
            <span>&middot;</span>
            <p className="text-sm font-light">{portal.data.bio}</p>
          </div>
        </header>

        <Tabs
          className="w-full"
          defaultValue={portal.data.hasContactInfoLocked ? "links" : "contact"}
        >
          <TabsList className="mb-4 flex w-full border border-border/50">
            {!portal.data.hasContactInfoLocked && (
              <TabsTrigger value="contact" className="flex-grow">
                Contact
              </TabsTrigger>
            )}

            <TabsTrigger value="links" className="flex-grow">
              Links
            </TabsTrigger>
          </TabsList>

          {!portal.data.hasContactInfoLocked && (
            <TabsContent value="contact">
              <ContactInfo unlocked={portal.unlocked} data={portal.data?.contactJSON} />
            </TabsContent>
          )}

          <TabsContent value="links">
            <ul className="flex w-full flex-col gap-2">
              {!portal.data.links.length && (
                <Alert className="border-dashed">
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
      </article>

      <GetYours />
    </section>
  );
};
