"use client";

import {
  DashboardIcon,
  EnvelopeClosedIcon,
  GearIcon,
  RulerSquareIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { ClerkLoaded, ClerkLoading, UserButton } from "@clerk/nextjs";
import { Skeleton } from "../ui/skeleton";
import Image from "next/image";
import { useTranslations } from "next-intl";

export const Sidebar = () => {
  const selectedSegment = useSelectedLayoutSegment();
  const t = useTranslations("admin.sidebar");

  return (
    <aside className="flex h-16 max-h-16 min-h-16 items-center justify-between overflow-x-auto border-t md:h-full md:max-h-full md:min-w-20 md:max-w-20 md:flex-col md:items-center md:rounded-r-2xl md:border-y md:border-r md:py-4">
      <Button size="icon" variant="ghost" className="h-[44px] w-[44px] overflow-hidden">
        <Image src="/logo-light.png" alt="concard-logo" width={48} height={48} />
      </Button>

      <ul className="flex w-full flex-grow justify-center gap-2 md:flex-grow-0 md:flex-col md:items-center md:gap-4">
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                asChild
                variant={!selectedSegment ? "primary_ghost" : "ghost"}
                size="icon"
                aria-selected={!selectedSegment}
                className="h-[44px] w-[44px]"
              >
                <Link href="/admin">
                  <DashboardIcon className="h-5 w-5" />
                  <span className="sr-only">{t("links.title")}</span>
                </Link>
              </Button>
            </TooltipTrigger>

            <TooltipContent side="right">
              <span>{t("links.description")}</span>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                asChild
                variant={selectedSegment === "visual" ? "primary_ghost" : "ghost"}
                size="icon"
                aria-selected={selectedSegment === "visual"}
                className="h-[44px] w-[44px]"
              >
                <Link href="/admin/visual">
                  <RulerSquareIcon className="h-5 w-5" />
                  <span className="sr-only">{t("themes.title")}</span>
                </Link>
              </Button>
            </TooltipTrigger>

            <TooltipContent side="right">{t("themes.description")}</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                asChild
                variant={selectedSegment === "signatures" ? "primary_ghost" : "ghost"}
                size="icon"
                aria-selected={selectedSegment === "signatures"}
                className="h-[44px] w-[44px]"
              >
                <Link href="/admin/signatures">
                  <EnvelopeClosedIcon className="h-5 w-5" />
                  <span className="sr-only">{t("emails.title")}</span>
                </Link>
              </Button>
            </TooltipTrigger>

            <TooltipContent side="right">
              <span>{t("emails.description")}</span>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                asChild
                variant={selectedSegment === "settings" ? "primary_ghost" : "ghost"}
                size="icon"
                aria-selected={selectedSegment === "settings"}
                className="h-[44px] w-[44px]"
              >
                <Link href="/admin/settings">
                  <GearIcon className="h-5 w-5" />
                  <span className="sr-only">{t("settings.title")}</span>
                </Link>
              </Button>
            </TooltipTrigger>

            <TooltipContent side="right">
              <span>{t("settings.description")}</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </ul>

      <div>
        <ClerkLoading>
          <Skeleton className="h-10 w-10 rounded-full" />
        </ClerkLoading>

        <ClerkLoaded>
          <UserButton
            userProfileProps={{
              appearance: {
                elements: {
                  profileSectionPrimaryButton__username: "hidden",
                },
              },
            }}
            appearance={{
              elements: {
                userButtonAvatarBox: "w-10 h-10",
                profileSectionPrimaryButton__username: "hidden",
                userPreviewSecondaryIdentifier: "font-semibold tracking-wide",
              },
            }}
          />
        </ClerkLoaded>
      </div>
    </aside>
  );
};
