"use client";

import {
  CheckCircledIcon,
  ChevronRightIcon,
  CopyIcon,
  LinkedInLogoIcon,
  Share2Icon,
  TwitterLogoIcon,
} from "@radix-ui/react-icons";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Skeleton } from "../ui/skeleton";
import { env } from "~/env";
import { useTranslations } from "next-intl";

export const ShareLink = ({ username, pageHashKey }: { username: string; pageHashKey: string }) => {
  const baseUrl = env.NEXT_PUBLIC_BASE_URL;
  const fullUrl = `${baseUrl}/${username}`;
  const withHash = `${fullUrl}?ktp=${pageHashKey}`;

  const t = useTranslations();

  const [copied, setCopied] = useState(false);

  const handleCopy = (e: Event) => {
    e.preventDefault();

    void navigator.clipboard.writeText(withHash);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  const handleLinkedInShare = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${withHash}&text=Check out my ConCard portal page! ${fullUrl}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const handleXShare = () => {
    window.open(
      `https://x.com/share/?url=${withHash}&text=Check out my ConCard portal page!`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="w-full" variant="primary_ghost">
          <Share2Icon />
          {t("admin.onboarding.steps.finale.banners.sharePortal.action")}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-[320px]" sideOffset={10}>
        <DropdownMenuLabel className="text-lg">
          {t("admin.portal.shareLink.title")}
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="mb-0" />

        <DropdownMenuLabel
          className="-mx-1 bg-background py-2.5 text-base font-light"
          onCopy={(e) => {
            e.stopPropagation();
            e.preventDefault();
            handleCopy(e as unknown as Event);
          }}
        >
          {fullUrl}
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="mt-0" />

        <DropdownMenuGroup>
          <DropdownMenuItem onSelect={handleCopy} className="text-base">
            <CopyIcon />
            {t("admin.portal.shareLink.copyLink")}
            {copied && <CheckCircledIcon className="ml-auto text-emerald-600" />}
          </DropdownMenuItem>

          <DropdownMenuItem onSelect={handleXShare} className="text-base">
            <TwitterLogoIcon />
            {t("admin.portal.shareLink.shareViaTwitter")}
            <ChevronRightIcon className="ml-auto" />
          </DropdownMenuItem>

          <DropdownMenuItem onSelect={handleLinkedInShare} className="text-base">
            <LinkedInLogoIcon />
            {t("admin.portal.shareLink.shareViaLinkedIn")}
            <ChevronRightIcon className="ml-auto" />
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const ShareLinkLoader = () => {
  return <Skeleton className="h-10 w-full rounded-full" />;
};
