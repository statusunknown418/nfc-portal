"use client";

import { type DraggableAttributes } from "@dnd-kit/core";
import { DragHandleDots2Icon, HamburgerMenuIcon, TrashIcon } from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";
import { forwardRef } from "react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { cn, OutlinedSocialIcons } from "~/lib/utils";
import { type RouterOutputs } from "~/trpc/react";
import { EditSocialLink } from "./social-links/EditSocialLink";

export const SocialLinkItem = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    data: RouterOutputs["links"]["all"][number];
    attributes?: DraggableAttributes;
    listeners?: Record<string, unknown>;
    username: string;
  }
>(({ data, className, listeners, attributes, ...props }, ref) => {
  const t = useTranslations();

  return (
    <EditSocialLink>
      <section
        ref={ref}
        className={cn(
          "flex cursor-pointer items-center justify-between gap-5 rounded-lg border bg-white p-2 pl-0 transition-all hover:shadow-lg",
          data.socialType === "twitter" && "bg-neutral-100",
          data.socialType === "linkedin" && "bg-cyan-50",
          data.socialType === "facebook" && "bg-sky-50",
          data.socialType === "instagram" && "bg-pink-50",
          data.socialType === "github" && "bg-gray-50",
          data.socialType === "tiktok" && "bg-violet-50",
          data.socialType === "youtube" && "bg-rose-50",
          data.socialType === "telegram" && "bg-blue-50",
          data.socialType === "patreon" && "bg-purple-50",
          data.socialType === "spotify" && "bg-lime-50",
          className,
        )}
        {...props}
      >
        <Button variant="ghost" size="icon" className="cursor-grab" {...attributes} {...listeners}>
          <DragHandleDots2Icon />
        </Button>

        <div className="flex flex-col items-center gap-2">
          <OutlinedSocialIcons type={data.socialType!} className="size-8" />

          <h2 className="flex-grow text-sm font-medium">{data.displayText}</h2>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <HamburgerMenuIcon />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start">
            <DropdownMenuItem className="text-destructive">
              <TrashIcon />
              {t("admin.dashboard.actions.delete")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </section>
    </EditSocialLink>
  );
});

SocialLinkItem.displayName = "SocialLinkItem";
