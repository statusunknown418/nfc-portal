"use client";

import { Crosshair2Icon } from "@radix-ui/react-icons";
import { type ReactNode } from "react";
import { cn } from "~/lib/utils";

export const EmptyState = ({
  className,
  action,
  icon = <Crosshair2Icon />,
}: {
  className?: string;
  action?: ReactNode;
  icon?: ReactNode;
}) => {
  return (
    <section
      className={cn(
        "flex h-80 w-full flex-col items-center justify-center gap-2 rounded-xl border bg-muted/50 text-muted-foreground [&>svg]:h-6 [&>svg]:w-6",
        className,
      )}
    >
      {icon}
      <p>No links created yet.</p>
      {action}
    </section>
  );
};
