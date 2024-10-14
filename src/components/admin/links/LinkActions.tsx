"use client";

import {
  ArchiveIcon,
  EyeNoneIcon,
  EyeOpenIcon,
  HamburgerMenuIcon,
  Pencil2Icon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";
import { useMediaQuery } from "~/lib/hooks/use-media-query";
import { api, type RouterOutputs } from "~/trpc/react";

export const LinkActions = ({
  link,
  username,
}: {
  link: RouterOutputs["links"]["all"][number];
  username: string;
}) => {
  const utils = api.useUtils();
  const t = useTranslations("admin.dashboard");

  const toggleActive = api.links.toggleActive.useMutation({
    onMutate: (vars) => {
      const prevData = utils.links.all.getData();
      const newData = prevData?.map((item) =>
        item.id === vars.id ? { ...item, isActive: vars.active } : item,
      );

      utils.links.all.setData(undefined, newData);

      return prevData;
    },
    onSuccess: async () => {
      toast.success("Link updated!");
      await Promise.all([
        utils.viewer.previewPortal.invalidate(),
        utils.portals.get.invalidate({ username: username }),
        utils.links.all.invalidate(),
      ]);
    },
    onError: (err, _vars, context) => {
      toast.error(err.message);
      utils.links.all.setData(undefined, context);
    },
  });

  const deleteLink = api.links.delete.useMutation({
    onMutate: (vars) => {
      const prevData = utils.links.all.getData();
      const newData = prevData?.filter((item) => item.id !== vars.id);

      utils.links.all.setData(undefined, newData);

      return prevData;
    },
    onSuccess: async () => {
      toast.success("Link deleted!");
      await Promise.all([
        utils.viewer.previewPortal.invalidate(),
        utils.portals.get.invalidate({ username: username }),
        utils.links.all.invalidate(),
      ]);
    },
    onError: (err, _vars, context) => {
      toast.error(err.message);
      utils.links.all.setData(undefined, context);
    },
  });

  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleDelete = (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
    e.stopPropagation();

    toast.promise(deleteLink.mutateAsync({ id: link.id }), {
      loading: "Deleting...",
      success: `Removed ${link.displayText}`,
      error: "Failed to delete link",
    });

    e.currentTarget.tagName === "BUTTON" && setOpen(false);
  };

  const handleToggleActive = (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
    e.stopPropagation();

    toast.promise(toggleActive.mutateAsync({ id: link.id, active: !link.isActive }), {
      loading: "Hiding...",
      success: "Done!",
      error: "Failed to hide link",
    });

    e.currentTarget.tagName === "BUTTON" && setOpen(false);
  };

  if (isDesktop) {
    return (
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="group-hover:border-border/50">
                  <HamburgerMenuIcon className="text-muted-foreground group-hover:text-primary" />
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>

            <TooltipContent>{t("actions.label")}</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={handleToggleActive}>
            {link.isActive ? <EyeNoneIcon /> : <EyeOpenIcon />}
            {link.isActive ? t("actions.hide") : t("actions.show")}
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setOpen(false)}>
            <Pencil2Icon />
            {t("actions.editLink")}
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={handleDelete}
            className="text-destructive focus:bg-destructive/10 focus:text-destructive"
          >
            <TrashIcon />
            {t("actions.delete")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen} shouldScaleBackground={false}>
      <DrawerTrigger asChild onClick={(e) => e.stopPropagation()}>
        <Button variant="ghost" size="icon" className="group-hover:border-border/50">
          <HamburgerMenuIcon className="text-muted-foreground group-hover:text-primary" />
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader className="my-4">
          <DrawerTitle>{t("actions.label")}</DrawerTitle>
        </DrawerHeader>

        <div className="flex w-full flex-col gap-2 px-2 pb-8">
          <Button
            size="lg"
            variant="ghost"
            className="justify-start gap-3 px-4 text-base"
            onClick={handleToggleActive}
          >
            {link.isActive ? (
              <EyeNoneIcon className="h-5 w-5" />
            ) : (
              <EyeOpenIcon className="h-5 w-5" />
            )}
            {link.isActive ? t("actions.hide") : t("actions.show")}
          </Button>

          <Button
            size="lg"
            variant="ghost"
            className="justify-start gap-3 px-4 text-base"
            onClick={() => setOpen(false)}
          >
            <Pencil2Icon className="h-5 w-5" />
            {t("actions.editLink")}
          </Button>

          <Button
            size="lg"
            variant="ghost"
            className="justify-start gap-3 px-4 text-base"
            onClick={() => setOpen(false)}
          >
            <ArchiveIcon className="h-5 w-5" />
            {t("actions.archive")}
          </Button>

          <Button
            size="lg"
            variant="destructive_ghost"
            onClick={handleDelete}
            className="justify-start gap-3 px-4 text-base"
          >
            <TrashIcon className="h-5 w-5" />
            {t("actions.delete")}
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
