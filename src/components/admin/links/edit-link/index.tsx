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
import { useTranslations } from "next-intl";

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
  const t = useTranslations("admin.dashboard");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>

        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{t("editLinkModal.title")}</DialogTitle>
            <DialogDescription>{t("editLinkModal.description")}</DialogDescription>
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
          <DrawerTitle>{t("editLinkModal.title")}</DrawerTitle>
          <DrawerDescription>{t("editLinkModal.description")}</DrawerDescription>
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
            <Button variant="outline">{t("editLinkModal.cancel")}</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
