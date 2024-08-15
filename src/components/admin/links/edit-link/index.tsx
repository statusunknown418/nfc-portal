"use client";

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
import { type RouterOutputs } from "~/trpc/react";
import { AddEditLinkForm } from "../new-link/AddEditLinkForm";

export function EditLinkDrawer({
  data,
  children,
  username,
}: {
  data: RouterOutputs["links"]["all"][number];
  children?: React.ReactNode;
  username: string;
}) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit link</DialogTitle>
            <DialogDescription>Remember to click save when you&apos;re done.</DialogDescription>
          </DialogHeader>

          <AddEditLinkForm
            username={username}
            onClose={() => setOpen(false)}
            defaultValues={{
              ...data,
              userId: undefined,
            }}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen} shouldScaleBackground={false}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Edit link</DrawerTitle>
          <DrawerDescription>Remember to click save when you&apos;re done.</DrawerDescription>
        </DrawerHeader>

        <AddEditLinkForm
          className="px-4"
          username={username}
          onClose={() => setOpen(false)}
          defaultValues={{
            ...data,
            userId: undefined,
          }}
        />

        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
