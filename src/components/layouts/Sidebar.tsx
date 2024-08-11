"use client";

import { BoxModelIcon, ColorWheelIcon, GearIcon, Link2Icon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { Button } from "../ui/button";

export const Sidebar = () => {
  const selectedSegment = useSelectedLayoutSegment();

  return (
    <aside className="flex h-16 max-h-16 min-h-16 items-center justify-between overflow-x-auto border-t px-2 md:h-full md:max-h-full md:min-w-20 md:max-w-20 md:flex-col md:items-center md:border-r md:border-t-0 md:py-4">
      <Button size="icon" className="h-[44px] w-[44px]">
        <span>NU</span>
      </Button>

      <ul className="flex w-full flex-grow justify-center gap-2 opacity-70 md:flex-grow-0 md:flex-col md:items-center md:gap-4">
        <Button
          asChild
          variant={!selectedSegment ? "primary_ghost" : "ghost"}
          size="icon"
          aria-selected={!selectedSegment}
          className="h-[44px] w-[44px] aria-selected:opacity-100"
        >
          <Link href="/admin">
            <Link2Icon className="h-5 w-5" />
            <span className="sr-only">Links</span>
          </Link>
        </Button>

        <Button
          asChild
          variant={selectedSegment === "contact" ? "primary_ghost" : "ghost"}
          size="icon"
          aria-selected={selectedSegment === "contact"}
          className="h-[44px] w-[44px] aria-selected:opacity-100"
        >
          <Link href="/admin/contact">
            <BoxModelIcon className="h-5 w-5" />
          </Link>
        </Button>

        <Button
          asChild
          variant={selectedSegment === "visual" ? "primary_ghost" : "ghost"}
          size="icon"
          aria-selected={selectedSegment === "visual"}
          className="h-[44px] w-[44px] aria-selected:opacity-100"
        >
          <Link href="/admin/visual">
            <ColorWheelIcon className="h-5 w-5" />
            <span className="sr-only">Theming</span>
          </Link>
        </Button>

        <Button
          asChild
          variant={selectedSegment === "settings" ? "primary_ghost" : "ghost"}
          size="icon"
          aria-selected={selectedSegment === "settings"}
          className="h-[44px] w-[44px] aria-selected:opacity-100"
        >
          <Link href="/admin/settings">
            <GearIcon className="h-5 w-5" />
            <span className="sr-only">Settings</span>
          </Link>
        </Button>
      </ul>

      <Button className="h-[44px] w-[44px] text-xs md:text-sm" size="icon">
        <span>AA</span>
        <span className="sr-only">User</span>
      </Button>
    </aside>
  );
};
