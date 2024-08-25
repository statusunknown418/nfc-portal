import {
  CopyIcon,
  EnvelopeClosedIcon,
  HamburgerMenuIcon,
  LightningBoltIcon,
  TwitterLogoIcon,
} from "@radix-ui/react-icons";
import Image from "next/image";
import { cn } from "~/lib/utils";
import { type RouterOutputs } from "~/trpc/react";
import { Button } from "../ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { Divider } from "../ui/separator";
import { type ThemeType } from "~/server/db/schema";

export const LinkViewer = ({
  link,
  buttonStyles,
}: {
  link: RouterOutputs["links"]["all"][number];
  buttonStyles: ThemeType["buttons"];
}) => {
  return (
    <article
      style={{
        border: buttonStyles.border,
        background: buttonStyles.background,
      }}
      className={cn(
        "flex h-[4.5rem] w-full items-center justify-between gap-2 text-sm sm:text-base md:h-20 md:px-4 lg:px-6",
        buttonStyles.variant === "square" && "rounded-none px-2",
        buttonStyles.variant === "pill" && "rounded-3xl px-2.5",
        buttonStyles.variant === "rounded" && "rounded-lg px-2",
      )}
    >
      {!!link.thumbnail && (
        <Image
          src={link.thumbnail}
          alt={`link-thumbnail`}
          width={120}
          height={80}
          className={cn("aspect-square h-14 max-w-14 rounded-md md:h-16")}
          sizes="(max-width: 768px) 120px, 200px"
        />
      )}

      {!link.thumbnail && <div className="h-14 w-9" />}

      <div
        className="flex flex-grow justify-center text-center"
        style={{
          color: buttonStyles.textColor,
        }}
      >
        {link.displayText}
      </div>

      <Drawer>
        <DrawerTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn("min-w-9 hover:border-primary hover:bg-black/20 hover:text-white")}
          >
            <HamburgerMenuIcon />
          </Button>
        </DrawerTrigger>

        <DrawerContent className="mx-auto sm:max-w-4xl md:rounded-t-[40px]">
          <DrawerHeader>
            <DrawerTitle className="text-xl">Share this link</DrawerTitle>
            <DrawerDescription>
              You can get a similar page like this through our app!
            </DrawerDescription>
          </DrawerHeader>

          <ul className="m-4 flex flex-col overflow-hidden rounded-lg border bg-white p-0">
            <Button
              variant="ghost"
              className="justify-start rounded-l-none rounded-r-none rounded-t-lg border-0"
            >
              <CopyIcon />
              Copy link
            </Button>

            <Divider className="my-0" />

            <Button
              variant="ghost"
              className="justify-start rounded-l-none rounded-r-none border-0"
            >
              <EnvelopeClosedIcon />
              Share via email
            </Button>

            <Divider className="my-0" />

            <Button
              variant="ghost"
              className="justify-start rounded-b-lg rounded-l-none rounded-r-none border-0"
            >
              <TwitterLogoIcon className="text-sky-600" />
              Share via Twitter
            </Button>
          </ul>

          <DrawerFooter className="mb-6">
            <Button variant="primary" className="w-full">
              <LightningBoltIcon />
              Get yours
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Have it up and running in less than 5 minutes!
            </p>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </article>
  );
};
