"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { BoxModelIcon, FaceIcon, GearIcon, Link2Icon } from "@radix-ui/react-icons";
import { useSelectedLayoutSegment } from "next/navigation";

export const Sidebar = () => {
  const selectedSegment = useSelectedLayoutSegment();

  return (
    <aside className="flex h-14 max-h-14 min-h-14 items-center justify-between overflow-x-auto px-2 pb-2 sm:px-4 md:h-full md:max-h-full md:max-w-56 md:flex-col md:items-start md:py-4 lg:w-56">
      <Button
        className="w-10 justify-start p-2 text-xs sm:w-auto md:w-full md:text-sm"
        variant="ghost"
      >
        <span className="md:hidden">NU</span>
        <span className="hidden md:block">NearU.tech</span>
      </Button>

      <ul className="flex w-full flex-grow justify-center *:gap-3 *:opacity-70 md:flex-grow-0 md:flex-col md:justify-start md:gap-2 *:md:justify-start">
        <Button
          asChild
          variant={!selectedSegment ? "white" : "ghost"}
          aria-selected={!selectedSegment}
          className="w-full aria-selected:opacity-100"
        >
          <Link href="/admin">
            <Link2Icon />
            <span className="hidden sm:block">Links</span>
          </Link>
        </Button>

        <Button
          asChild
          variant={selectedSegment === "contact" ? "white" : "ghost"}
          aria-selected={selectedSegment === "contact"}
          className="w-full aria-selected:opacity-100"
        >
          <Link href="/admin/contact">
            <BoxModelIcon />
            <span className="hidden sm:block">Contact</span>
          </Link>
        </Button>

        <Button
          asChild
          variant={selectedSegment === "visual" ? "white" : "ghost"}
          aria-selected={selectedSegment === "visual"}
          className="w-full aria-selected:opacity-100"
        >
          <Link href="/admin/visual">
            <FaceIcon />
            <span className="hidden sm:block">Appearance</span>
          </Link>
        </Button>

        <Button
          asChild
          variant={selectedSegment === "settings" ? "white" : "ghost"}
          aria-selected={selectedSegment === "settings"}
          className="w-full aria-selected:opacity-100"
        >
          <Link href="/admin/settings">
            <GearIcon className="" />
            <span className="hidden sm:block">Settings</span>
          </Link>
        </Button>
      </ul>

      <Button className="w-10 text-xs sm:w-auto md:w-full md:text-sm" size="sm">
        <span>AA</span>
        <span className="hidden sm:block">User</span>
      </Button>
    </aside>
  );
};
