import React from "react";

import { cn } from "~/lib/utils";

type DividerProps = React.ComponentPropsWithoutRef<"div">;

const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  ({ className, children, ...props }, forwardedRef) => (
    <div
      ref={forwardedRef}
      className={cn(
        // base
        "mx-auto my-6 flex w-full items-center justify-between gap-3 text-sm",
        // text color
        "text-muted-foreground",
        className,
      )}
      {...props}
    >
      {children ? (
        <>
          <div
            className={cn(
              // base
              "h-[1px] w-full",
              // background color
              "bg-border",
            )}
          />
          <div className="whitespace-nowrap text-inherit">{children}</div>
          <div
            className={cn(
              // base
              "h-[1px] w-full",
              // background color
              "bg-border",
            )}
          />
        </>
      ) : (
        <div
          className={cn(
            // base
            "h-[1px] w-full",
            // backround color
            "bg-border",
          )}
        />
      )}
    </div>
  ),
);

Divider.displayName = "Divider";

export { Divider };
