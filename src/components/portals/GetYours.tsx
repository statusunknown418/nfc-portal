"use client";

import { Cross1Icon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useState } from "react";
import { Button } from "../ui/button";
import { api } from "~/trpc/react";

export const GetYours = ({ shouldShow = true }: { shouldShow?: boolean }) => {
  const [show, setShow] = useState(shouldShow);
  const action = api.portals.removeJoinBanner.useMutation({
    onSuccess: () => {
      setShow(false);
    },
  });

  if (!show) {
    return;
  }

  return (
    <div className="absolute bottom-10 left-0 flex w-full items-center justify-center">
      <section>
        <Button asChild className="rounded-full pr-4 shadow-lg" size="lg">
          <div>
            <Link href="/">🚀 Get your own page!</Link>

            <Button
              asChild
              variant="ghost"
              size="icon"
              className="ml-1"
              onClick={() => action.mutate()}
            >
              <span>
                <Cross1Icon className="h-3 w-3 text-muted-foreground" />
              </span>
            </Button>
          </div>
        </Button>
      </section>
    </div>
  );
};
