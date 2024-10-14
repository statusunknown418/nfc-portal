"use client";

import { Eye } from "@phosphor-icons/react";
import { useMediaQuery } from "@uidotdev/usehooks";
import { Button } from "~/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer";

export const MobilePreview = ({ children }: { children: React.ReactNode }) => {
  const isMediumDevice = useMediaQuery("(max-width : 992px)");

  if (!isMediumDevice) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-0 flex w-full items-center justify-center md:hidden">
      <Drawer>
        <DrawerTrigger asChild>
          <Button size="lg" className="h-12 rounded-full">
            <Eye weight="duotone" className="size-5 text-indigo-300" />
            Ver portal
          </Button>
        </DrawerTrigger>

        <DrawerContent className="h-[95%] w-full sm:h-4/5">
          <DrawerHeader>
            <DrawerTitle>Preview de tu página personal</DrawerTitle>
            <DrawerDescription className="text-pretty">
              Aquí puedes ver como se verá tu página personal en un dispositivo móvil. Para una
              mejor experiencia recomendamos utilizar la web ConCard a través de una laptop.
            </DrawerDescription>
          </DrawerHeader>

          <div className="relative mt-2 flex w-full justify-center overflow-y-auto pb-4">
            {children}
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};
