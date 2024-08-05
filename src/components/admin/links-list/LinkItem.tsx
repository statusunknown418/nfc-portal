import { type DraggableAttributes } from "@dnd-kit/core";
import { DragHandleDots2Icon, Pencil2Icon, TrashIcon } from "@radix-ui/react-icons";
import { forwardRef } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Divider } from "~/components/ui/separator";
import { cn } from "~/lib/utils";
import { type RouterOutputs } from "~/trpc/react";

export const LinkItem = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    data: RouterOutputs["links"]["all"][number];
    attributes?: DraggableAttributes;
    listeners?: Record<string, unknown>;
  }
>(({ data, className, listeners, attributes, ...props }, ref) => {
  return (
    <Card
      ref={ref}
      className={cn(
        "relative flex-grow overflow-hidden border-border px-8 shadow-muted",

        className,
      )}
      {...listeners}
      {...attributes}
      {...props}
    >
      <Button
        // asChild
        variant="ghost"
        className={cn(
          "absolute left-0 top-0 flex h-full w-8 cursor-grab items-center justify-center rounded-none border-r-border bg-muted/50 p-0 hover:border-y-transparent hover:border-l-transparent",
        )}
        {...listeners}
        {...attributes}
      >
        <DragHandleDots2Icon />
      </Button>

      <CardHeader>
        <CardTitle>{data.displayText}</CardTitle>
        <CardDescription className="text-indigo-600 underline">{data.url}</CardDescription>
      </CardHeader>

      <CardContent>
        <CardDescription>{data.layout}</CardDescription>
        <CardDescription>{data.layout}</CardDescription>
      </CardContent>

      <div
        className={cn(
          "absolute bottom-0 right-0 flex h-full w-10 flex-col items-center justify-center border-l border-border bg-muted/50",
        )}
      >
        <Button variant="ghost" className="w-full flex-grow rounded-none border-none p-0">
          <Pencil2Icon />
        </Button>

        <Divider className={cn("my-0 w-full")} />

        <Button
          variant="destructiveGhost"
          className="w-full flex-grow rounded-none rounded-br-xl border-transparent p-0 hover:border-destructive"
        >
          <TrashIcon />
        </Button>
      </div>
    </Card>
  );
});

LinkItem.displayName = "LinkItem";
