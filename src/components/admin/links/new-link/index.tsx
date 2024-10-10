"use client";

import { PlusIcon } from "@radix-ui/react-icons";
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
import { AddEditLinkForm } from "./AddEditLinkForm";

export function NewLinkDrawer({ username }: { username: string }) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const t = useTranslations("admin.dashboard");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="secondary_ghost" size="lg" className="h-14 text-sm">
            <PlusIcon className="size-5" /> Other links
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-xl">New link</DialogTitle>
            <DialogDescription>
              Choose from the list of the predefined links or create a new one.
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
        <Button size={"lg"} variant="secondary_ghost" className="h-14 text-sm">
          <PlusIcon className="size-5" /> Other links
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
