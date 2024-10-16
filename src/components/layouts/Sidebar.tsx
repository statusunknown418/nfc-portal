"use client";

import { ClerkLoaded, ClerkLoading, UserButton } from "@clerk/nextjs";
import { AddressBook } from "@phosphor-icons/react";
import { Flag } from "@phosphor-icons/react/dist/ssr";
import {
  DashboardIcon,
  EnvelopeClosedIcon,
  GearIcon,
  RulerSquareIcon,
} from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

export const Sidebar = () => {
  const selectedSegment = useSelectedLayoutSegment();
  const t = useTranslations("admin.sidebar");
  const common = useTranslations("common");

  return (
    <nav className="sticky top-0 z-10 flex h-14 w-full justify-center border-b bg-background/50 py-0 backdrop-blur-sm md:sticky md:top-0">
      <div className="grid w-full max-w-[1400px] grid-cols-3 items-center justify-between overflow-x-auto px-4 md:grid-cols-6">
        <Button variant="ghost" className="h-10 w-10 overflow-hidden p-0 md:w-max md:px-1">
          <Image
            src="/logo-light.png"
            className="rounded-md"
            alt="concard-logo"
            width={32}
            height={32}
          />

          <span className="hidden lg:block">ConCard</span>
        </Button>

        <section className="flex w-full justify-center gap-2 md:col-span-4 md:flex-grow-0 md:items-center md:gap-4">
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  asChild
                  variant={!selectedSegment ? "primary_ghost" : "ghost"}
                  aria-selected={!selectedSegment}
                  className="h-[44px] w-[44px] rounded-none border-2 !border-x-transparent !border-t-transparent py-1 aria-selected:border-b-current aria-selected:bg-transparent aria-selected:hover:bg-primary/5 md:h-12 md:w-max"
                >
                  <Link href="/admin">
                    <DashboardIcon className="size-6 md:size-5" />
                    <span className="sr-only">{t("links.title")}</span>
                    <span className="hidden md:block">{t("links.title")}</span>
                  </Link>
                </Button>
              </TooltipTrigger>

              <TooltipContent className="md:hidden">
                <span>{t("links.description")}</span>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  asChild
                  variant={selectedSegment === "contact" ? "primary_ghost" : "ghost"}
                  aria-selected={selectedSegment === "contact"}
                  className="h-[44px] w-[44px] rounded-none border-2 !border-x-transparent !border-t-transparent py-1 aria-selected:border-b-current aria-selected:bg-transparent aria-selected:hover:bg-primary/5 md:h-12 md:w-max"
                >
                  <Link href="/admin/contact">
                    <AddressBook className="size-6 md:size-5" />
                    <span className="sr-only">Contact info</span>
                    <span className="hidden md:block">Contact info</span>
                  </Link>
                </Button>
              </TooltipTrigger>

              <TooltipContent className="md:hidden">{t("themes.description")}</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  asChild
                  variant={selectedSegment === "visual" ? "primary_ghost" : "ghost"}
                  aria-selected={selectedSegment === "visual"}
                  className="h-[44px] w-[44px] rounded-none border-2 !border-x-transparent !border-t-transparent py-1 aria-selected:border-b-current aria-selected:bg-transparent aria-selected:hover:bg-primary/5 md:h-12 md:w-max"
                >
                  <Link href="/admin/visual">
                    <RulerSquareIcon className="size-6 md:size-5" />
                    <span className="sr-only">{t("themes.title")}</span>
                    <span className="hidden md:block">{t("themes.title")}</span>
                  </Link>
                </Button>
              </TooltipTrigger>

              <TooltipContent className="md:hidden">{t("themes.description")}</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  asChild
                  variant={selectedSegment === "signatures" ? "primary_ghost" : "ghost"}
                  aria-selected={selectedSegment === "signatures"}
                  className="h-[44px] w-[44px] rounded-none border-2 !border-x-transparent !border-t-transparent py-1 aria-selected:border-b-current aria-selected:bg-transparent aria-selected:hover:bg-primary/5 md:h-12 md:w-max"
                >
                  <Link href="/admin/signatures">
                    <EnvelopeClosedIcon className="size-6 md:size-5" />
                    <span className="sr-only">{t("emails.title")}</span>
                    <span className="hidden md:block">{t("emails.title")}</span>
                  </Link>
                </Button>
              </TooltipTrigger>

              <TooltipContent className="md:hidden">
                <span>{t("emails.description")}</span>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  asChild
                  variant={selectedSegment === "settings" ? "primary_ghost" : "ghost"}
                  aria-selected={selectedSegment === "settings"}
                  className="h-[44px] w-[44px] rounded-none border-2 !border-x-transparent !border-t-transparent py-1 aria-selected:border-b-current aria-selected:bg-transparent aria-selected:hover:bg-primary/5 md:h-12 md:w-max"
                >
                  <Link href="/admin/settings">
                    <GearIcon className="size-6 md:size-5" />
                    <span className="sr-only">{t("settings.title")}</span>
                    <span className="hidden md:block">{t("settings.title")}</span>
                  </Link>
                </Button>
              </TooltipTrigger>

              <TooltipContent className="md:hidden">
                <span>{t("settings.description")}</span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </section>

        <div className="justify-self-end">
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
            >
              <UserButton.MenuItems>
                <UserButton.Link
                  label={common("changeLanguage")}
                  href="/admin/settings"
                  labelIcon={<Flag weight="duotone" size={16} />}
                />
              </UserButton.MenuItems>
            </UserButton>
          </ClerkLoaded>
        </div>
      </div>
    </nav>
  );
};
