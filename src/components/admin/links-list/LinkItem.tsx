import { type DraggableAttributes } from "@dnd-kit/core";
import { DragHandleDots1Icon, TrashIcon } from "@radix-ui/react-icons";
import { forwardRef } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Divider } from "~/components/ui/separator";
import { Switch } from "~/components/ui/switch";
import { cn } from "~/lib/utils";
import { type RouterOutputs } from "~/trpc/react";
import { EditLinkDrawer } from "../edit-link";
import { Label } from "~/components/ui/label";

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
        "relative flex-grow overflow-hidden border-border px-9 shadow-muted",
        !data.isActive && "border-dashed border-yellow-600/70 bg-accent/50",
        className,
      )}
      {...props}
    >
      <Button
        variant="ghost"
        className={cn(
          "absolute left-0 top-0 flex h-full w-9 cursor-grab items-center justify-center rounded-none border-r-border bg-muted/50 p-0 hover:border-y-transparent hover:border-l-transparent",
          !data.isActive && "border-dashed",
        )}
        {...listeners}
        {...attributes}
      >
        <DragHandleDots1Icon className="h-5 w-5" />
      </Button>

      <section className="flex flex-col-reverse justify-center sm:flex-row sm:items-start sm:justify-between">
        <CardHeader className="pt-4 sm:pt-6">
          <CardTitle>{data.displayText}</CardTitle>
          <CardDescription className="text-indigo-600 underline">{data.url}</CardDescription>
        </CardHeader>

        <Divider className="my-0 mt-2 sm:hidden" />

        <div className="sm:mpt-6 mt-2 flex w-max items-center gap-2 rounded-sm pl-6 sm:pl-0 sm:pr-8 sm:pt-4">
          <Label className="sm:sr-only" htmlFor={`activate-${data.id}`}>
            {data.isActive ? "Disable" : "Enable"}
          </Label>

          <Switch className="data-[state=checked]:bg-indigo-600" id={`activate-${data.id}`} />
        </div>
      </section>

      <CardContent>
        <CardDescription>{data.layout}</CardDescription>
        <CardDescription>{data.layout}</CardDescription>
      </CardContent>

      <div
        vaul-drawer-wrapper=""
        className={cn(
          "absolute bottom-0 right-0 flex h-full w-10 flex-col items-center justify-center border-l border-border bg-muted/50",
        )}
      >
        <EditLinkDrawer />

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
