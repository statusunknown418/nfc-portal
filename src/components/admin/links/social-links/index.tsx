"use client";

import { Perspective } from "@phosphor-icons/react";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer";
import { useMediaQuery } from "~/lib/hooks/use-media-query";
import { SocialLInksForm } from "./SocialLInksForm";

export const AddSocialLinks = ({ username }: { username: string }) => {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const t = useTranslations("admin.dashboard");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            size="lg"
            className="h-14 cursor-pointer select-none shadow-lg shadow-indigo-200 transition-all hover:shadow-indigo-300 md:items-center md:gap-5"
          >
            <Perspective className="size-5 text-indigo-300 md:size-7" />

            <h3 className="flex-grow text-left text-base">{t("socialLinks.title")}</h3>

            <ChevronDownIcon className="size-5" />
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-2xl">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-xl">{t("socialLinks.modal.title")}</DialogTitle>
            <DialogDescription>{t("socialLinks.modal.description")}</DialogDescription>
          </DialogHeader>

          <SocialLInksForm username={username} onClose={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          size="lg"
          className="h-14 cursor-pointer select-none gap-2 shadow-lg shadow-indigo-200 transition-all hover:shadow-indigo-300 md:items-center md:gap-5"
        >
          <Perspective className="size-5 text-indigo-300 md:size-7" />

          <h3 className="flex-grow text-left text-base">{t("socialLinks.title")}</h3>

          <ChevronDownIcon className="size-5" />
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{t("socialLinks.modal.title")}</DrawerTitle>
          <DrawerDescription>{t("socialLinks.modal.description")}</DrawerDescription>
        </DrawerHeader>

        <div className="mb-4 px-4">
          <SocialLInksForm username={username} onClose={() => setOpen(false)} />
        </div>

        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline" size="lg">
              {t("editLinkModal.cancel")}
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
