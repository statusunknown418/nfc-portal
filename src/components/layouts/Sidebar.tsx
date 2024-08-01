"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { BoxModelIcon, FaceIcon, GearIcon, Link2Icon } from "@radix-ui/react-icons";
import { useSelectedLayoutSegment } from "next/navigation";

export const Sidebar = () => {
  const selectedSegment = useSelectedLayoutSegment();

  return (
    <aside className="flex h-full w-56 max-w-56 flex-col justify-between p-5">
      <h2 className="text-sm font-bold">NearU.tech</h2>

      <ul className="flex flex-col gap-2 *:justify-start *:gap-3 *:opacity-70">
        <Button
          asChild
          variant={!selectedSegment ? "white" : "ghost"}
          aria-selected={!selectedSegment}
          className="aria-selected:opacity-100"
        >
          <Link href="/admin">
            <Link2Icon />
            Links
          </Link>
        </Button>

        <Button
          asChild
          variant={selectedSegment === "contact" ? "white" : "ghost"}
          aria-selected={selectedSegment === "contact"}
          className="aria-selected:opacity-100"
        >
          <Link href="/admin/contact">
            <BoxModelIcon />
            Contact
          </Link>
        </Button>

        <Button
          asChild
          variant={selectedSegment === "visual" ? "white" : "ghost"}
          aria-selected={selectedSegment === "visual"}
          className="aria-selected:opacity-100"
        >
          <Link href="/admin/visual">
            <FaceIcon />
            Appearance
          </Link>
        </Button>

        <Button
          asChild
          variant={selectedSegment === "settings" ? "white" : "ghost"}
          aria-selected={selectedSegment === "settings"}
          className="aria-selected:opacity-100"
        >
          <Link href="/admin/settings">
            <GearIcon className="" />
            Settings
          </Link>
        </Button>
      </ul>

      <Button>User</Button>
    </aside>
  );
};
