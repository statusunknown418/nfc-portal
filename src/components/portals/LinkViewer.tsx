import {
  CheckCircledIcon,
  CopyIcon,
  EnvelopeClosedIcon,
  HamburgerMenuIcon,
  LightningBoltIcon,
  TwitterLogoIcon,
} from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { type ComponentProps, type MouseEventHandler, useState } from "react";
import { toast } from "sonner";
import { cn, preventBackdropClick } from "~/lib/utils";
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
  styles,
}: {
  link: RouterOutputs["links"]["all"][number];
  styles: ThemeType;
}) => {
  const t = useTranslations("admin");
  const [copied, setCopied] = useState(false);

  const commonProps: Pick<ComponentProps<"div">, "className" | "style"> = {
    style: {
      borderWidth: "1px",
      borderColor: styles.buttons.borderColor ?? "transparent",
      borderStyle: styles.buttons.borderStyle,
      background: styles.colors.subtle,
    },
    className: cn(
      "flex h-14 w-full transition-all hover:scale-105 items-center cursor-pointer justify-between gap-2 text-sm active:ring active:ring-ring active:ring-offset-1 sm:text-base md:h-20 md:px-4 lg:px-6",
      styles.buttons.variant === "square" && "rounded-none px-2",
      styles.buttons.variant === "pill" && "rounded-[34px] px-2.5",
      styles.buttons.variant === "rounded" && "rounded-lg px-2",
    ),
  };

  const handleLinkCopy: MouseEventHandler = (e) => {
    void navigator.clipboard.writeText(link.url ?? "");
    toast.success("Link copied to clipboard!");

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1000);

    e.preventDefault();
    e.nativeEvent.preventDefault();
  };

  const Component = ({ children }: { children: React.ReactNode }) => {
    if (link.url && link.type !== "deployable") {
      return (
        <Link href={{ pathname: link.url }} {...commonProps}>
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
                <Link href={{ pathname: link.url }}>
                  {!!link.buttonLabel ? link.buttonLabel : "See more"}
                </Link>
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  };

  return (
    <Component>
      <div className="h-12 w-9 overflow-hidden">
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
          color: styles.buttons.textColor,
          fontStyle: styles.buttons.fontStyle,
          fontWeight: styles.buttons.fontWeight,
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
            <DrawerTitle className="text-xl">{t("portal.shareLink.title")}</DrawerTitle>
            <DrawerDescription>{t("portal.shareLink.description")}</DrawerDescription>
          </DrawerHeader>

          <ul className="m-4 flex flex-col overflow-hidden rounded-lg border bg-white p-0">
            <Button
              onClick={handleLinkCopy}
              variant="ghost"
              className="justify-start rounded-l-none rounded-r-none rounded-t-lg border-0"
            >
              <CopyIcon />
              {t("portal.shareLink.copyLink")}
              {copied && <CheckCircledIcon className="ml-auto text-emerald-600" />}
            </Button>

            <Divider className="my-0" />

            <Button
              variant="ghost"
              className="justify-start rounded-l-none rounded-r-none border-0"
            >
              <EnvelopeClosedIcon />
              {t("portal.shareLink.shareViaEmail")}
            </Button>

            <Divider className="my-0" />

            <Button
              variant="ghost"
              className="justify-start rounded-b-lg rounded-l-none rounded-r-none border-0"
            >
              <TwitterLogoIcon className="text-sky-600" />
              {t("portal.shareLink.shareViaTwitter")}
            </Button>
          </ul>

          <DrawerFooter className="mb-6">
            <Button variant="primary" className="w-full">
              <LightningBoltIcon />
              {t("portal.shareLink.getYours")}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              {t("portal.shareLink.getYoursDescription")}
            </p>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Component>
  );
};
