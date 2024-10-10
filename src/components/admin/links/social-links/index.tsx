"use client";

import { Perspective } from "@phosphor-icons/react";
import { BackpackIcon, ChevronDownIcon } from "@radix-ui/react-icons";
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
            asChild
            size="lg"
            className="h-14 cursor-pointer select-none items-start gap-2 px-4 py-2 shadow-lg shadow-indigo-200 transition-all hover:shadow-indigo-300 md:items-center md:gap-5"
          >
            <section>
              <Perspective className="size-5 text-indigo-300 md:size-7" />

              <div className="flex flex-grow flex-col gap-0 text-wrap">
                <h3 className="text-base">Add social links</h3>
                <p className="text-xs font-normal text-muted-foreground">
                  Choose from a list of available predefined social links
                </p>
              </div>

              <ChevronDownIcon className="size-5" />
            </section>
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Add social links</DialogTitle>
            <DialogDescription>
              Choose from the list of the predefined links or create a new one.
            </DialogDescription>
          </DialogHeader>

          <SocialLInksForm username={username} onClose={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen} shouldScaleBackground={false}>
      <DrawerTrigger asChild>
        <Button
          asChild
          size="lg"
          className="h-auto cursor-pointer select-none items-start gap-2 px-4 py-2 shadow-lg shadow-indigo-200 transition-all hover:shadow-indigo-300 md:items-center md:gap-5"
        >
          <section>
            <Perspective className="size-5 text-indigo-300 md:size-7" />

            <div className="flex flex-grow flex-col text-wrap">
              <h3 className="text-base">Add social links</h3>
              <p className="text-xs font-normal text-muted-foreground md:text-sm">
                Choose from the list of available predefined social links
              </p>
            </div>
          </section>
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Add social links</DrawerTitle>
          <DrawerDescription>
            Choose from the list of the predefined links or create a new one.
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4">
          <SocialLInksForm username={username} onClose={() => setOpen(false)} />
        </div>

        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
