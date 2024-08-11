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
import { NewLinkForm } from "./NewLinkForm";

export function NewLinkDrawer() {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            size="lg"
            className="w-full shadow-xl shadow-indigo-100 transition-all duration-300 hover:shadow-indigo-400"
          >
            <PlusIcon />
            Add link
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl">New link</DialogTitle>
            <DialogDescription>
              Choose from the list of available layouts and customize the link to your liking.
            </DialogDescription>
          </DialogHeader>

          <NewLinkForm onClose={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen} shouldScaleBackground={false}>
      <DrawerTrigger asChild>
        <Button
          size="lg"
          className="w-full shadow-xl shadow-indigo-100 transition-all duration-300 hover:shadow-indigo-400"
        >
          <PlusIcon />
          Add link
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>New link</DrawerTitle>
          <DrawerDescription>
            Choose from the list of available layouts and customize the link to your liking.
          </DrawerDescription>
        </DrawerHeader>

        <NewLinkForm className="px-4" onClose={() => setOpen(false)} />

        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
