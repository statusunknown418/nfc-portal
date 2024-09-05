"use client";

import { CheckIcon, CopyIcon, Share2Icon } from "@radix-ui/react-icons";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
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

  const copyToClipboard = () => {
    void navigator.clipboard.writeText(withHash);
    toast.success("Copied to clipboard!");
    setCopied(true);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="max-w-max rounded-full" variant="primary" size="lg">
          <Share2Icon />
          Share
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[320px]" sideOffset={10}>
        <h2 className="mb-2 text-lg font-semibold">Share your link!</h2>

        <div className="flex w-full items-center gap-2">
          <Input
            readOnly
            autoFocus={false}
            value={fullUrl}
            className="w-full cursor-default select-none bg-muted"
          />

          <Button size="icon" variant="primary_ghost" autoFocus onClick={copyToClipboard}>
            {copied ? <CheckIcon /> : <CopyIcon />}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export const ShareLinkLoader = () => {
  return <Skeleton className="h-10 w-full rounded-full" />;
};
