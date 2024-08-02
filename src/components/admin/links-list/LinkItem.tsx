import { forwardRef } from "react";
import { Card, CardHeader, CardTitle } from "~/components/ui/card";
import { cn } from "~/lib/utils";
import { type RouterOutputs } from "~/trpc/react";

export const LinkItem = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    data: RouterOutputs["links"]["all"][number];
  }
>(({ data, className, ...props }, ref) => {
  return (
    <Card ref={ref} className={cn("flex-grow", className)} {...props}>
      <CardHeader>
        <CardTitle>{data.displayText}</CardTitle>
      </CardHeader>
    </Card>
  );
});

LinkItem.displayName = "LinkItem";
