"use client";

import { PlusIcon } from "@radix-ui/react-icons";
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
import { AddEditLinkForm } from "./AddEditLinkForm";
import { useTranslations } from "next-intl";

export function NewLinkDrawer({ username }: { username: string }) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const t = useTranslations("admin.dashboard");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            size="lg"
            className="w-full min-w-40 shadow-xl shadow-indigo-100 transition-all duration-300 hover:shadow-indigo-400 sm:rounded-r-none"
          >
            <PlusIcon />
            {t("actions.addLink")}
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-xl">New link</DialogTitle>
            <DialogDescription>
              Choose from the list of available layouts and customize the link to your liking.
            </DialogDescription>
          </DialogHeader>

          <AddEditLinkForm onClose={() => setOpen(false)} username={username} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen} shouldScaleBackground={false}>
      <DrawerTrigger asChild>
        <Button
          size="lg"
          className="w-full min-w-40 shadow-xl shadow-indigo-100 transition-all duration-300 hover:shadow-indigo-400 sm:rounded-r-none"
        >
          <PlusIcon />
          {t("actions.addLink")}
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>New link</DrawerTitle>
          <DrawerDescription>
            Choose from the list of available layouts and customize the link to your liking.
          </DrawerDescription>
        </DrawerHeader>

        <AddEditLinkForm className="px-4" onClose={() => setOpen(false)} username={username} />

        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
