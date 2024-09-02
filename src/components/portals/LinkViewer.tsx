import {
  CopyIcon,
  EnvelopeClosedIcon,
  HamburgerMenuIcon,
  LightningBoltIcon,
  TwitterLogoIcon,
} from "@radix-ui/react-icons";
import Image from "next/image";
import Link from "next/link";
import { type ComponentProps, useState } from "react";
import { cn, newShade, preventBackdropClick } from "~/lib/utils";
import { type ThemeType } from "~/server/db/schema";
import { type RouterOutputs } from "~/trpc/react";
import { Button } from "../ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { Divider } from "../ui/separator";

export const LinkViewer = ({
  link,
  buttonStyles,
}: {
  link: RouterOutputs["links"]["all"][number];
  buttonStyles: ThemeType["buttons"];
}) => {
  const [hover, setHover] = useState(false);

  const commonProps: Pick<ComponentProps<"div">, "className" | "style"> = {
    style: {
      border: buttonStyles.border,
      background: hover ? newShade(buttonStyles.background, 20) : buttonStyles.background,
    },
    className: cn(
      "flex h-16 w-full transition-all hover:scale-105  items-center cursor-pointer justify-between gap-2 text-sm active:ring active:ring-ring active:ring-offset-1 sm:text-base md:h-20 md:px-4 lg:px-6",
      buttonStyles.variant === "square" && "rounded-none px-2",
      buttonStyles.variant === "pill" && "rounded-3xl px-2.5",
      buttonStyles.variant === "rounded" && "rounded-lg px-2",
    ),
  };

  const Component = ({ children }: { children: React.ReactNode }) => {
    if (link.url && link.type !== "deployable") {
      return (
        <Link
          href={{ pathname: link.url }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          {...commonProps}
        >
          {children}
        </Link>
      );
    }

    return (
      <Drawer>
        <DrawerTrigger asChild>
          <section {...commonProps}>{children}</section>
        </DrawerTrigger>

        <DrawerContent className="mx-auto w-full sm:max-w-4xl md:rounded-t-[40px]">
          <DrawerHeader>
            <DrawerTitle className="text-xl" autoFocus>
              {link.displayText}
            </DrawerTitle>
          </DrawerHeader>

          <p className="px-5">{link.description}</p>

          <DrawerFooter>
            <DrawerClose asChild>
              <Button asChild>
                <Link href={{ pathname: link.url }}>{link.buttonLabel}</Link>
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  };

  return (
    <Component>
      <div className="h-12 w-9">
        {!!link.thumbnail && (
          <Image
            width={56}
            height={56}
            src={link.thumbnail}
            alt={`link-thumbnail`}
            className={cn("rounded-md object-cover")}
          />
        )}
      </div>

      <div
        className="flex flex-grow justify-center text-center"
        style={{
          color: buttonStyles.textColor,
        }}
      >
        {link.displayText}
      </div>

      <Drawer modal>
        <DrawerTrigger asChild>
          <Button
            onClick={preventBackdropClick}
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
    </Component>
  );
};
