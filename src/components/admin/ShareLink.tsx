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

export const ShareLink = ({
  username,
  pageHashKey,
  baseUrl,
}: {
  username: string;
  pageHashKey: string;
  baseUrl: string;
}) => {
  const fullUrl = `${baseUrl}/${username}`;
  const withHash = `${fullUrl}?ktp=${pageHashKey}`;

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
      `https://www.linkedin.com/sharing/share-offsite/?url=${withHash}&text=Check my NFC portal! ${fullUrl}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const handleXShare = () => {
    window.open(
      `https://x.com/share/?url=${withHash}&text=Check my NFC portal!`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="max-w-max rounded-full" variant="primary" size="lg">
          <Share2Icon />
          Share portal
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-[320px]" sideOffset={10}>
        <DropdownMenuLabel className="text-lg">Share link</DropdownMenuLabel>

        <DropdownMenuSeparator className="mb-0" />

        <DropdownMenuLabel className="-mx-1 bg-background py-2.5 text-base font-light">
          {fullUrl}
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="mt-0" />

        <DropdownMenuGroup>
          <DropdownMenuItem onSelect={handleCopy} className="text-base">
            <CopyIcon />
            Copy link
            {copied && <CheckCircledIcon className="ml-auto text-emerald-600" />}
          </DropdownMenuItem>

          <DropdownMenuItem onSelect={handleXShare} className="text-base">
            <TwitterLogoIcon />
            Share to X
            <ChevronRightIcon className="ml-auto" />
          </DropdownMenuItem>

          <DropdownMenuItem onSelect={handleLinkedInShare} className="text-base">
            <LinkedInLogoIcon />
            Share to LinkedIn
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
