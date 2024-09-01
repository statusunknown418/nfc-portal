import { type DraggableAttributes } from "@dnd-kit/core";
import {
  DragHandleDots1Icon,
  ExternalLinkIcon,
  InstagramLogoIcon,
  ReaderIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";
import { forwardRef } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";
import { cn } from "~/lib/utils";
import { type RouterOutputs } from "~/trpc/react";
import { EditLinkDrawer } from "./edit-link";
import { LinkActions } from "./LinkActions";

export const LinkItem = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    data: RouterOutputs["links"]["all"][number];
    username: string;
    attributes?: DraggableAttributes;
    listeners?: Record<string, unknown>;
  }
>(({ data, className, username, listeners, attributes, ...props }, ref) => {
  return (
    <EditLinkDrawer data={data} username={username}>
      <Card
        id={`#item-${data.id}`}
        ref={ref}
        className={cn(
          "group relative flex-grow cursor-pointer overflow-hidden border-border px-9 shadow-none transition-shadow duration-200 hover:shadow-lg dark:shadow-muted",
          !data.isActive && [
            "border-dashed border-amber-700",
            "bg-transparent !text-muted-foreground",
            "hover:shadow-none",
          ],
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

        <section className="flex">
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="group ml-4 mt-6 flex">
                  {data.type === "basic" && (
                    <ExternalLinkIcon className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                  )}

                  {data.type === "deployable" && (
                    <ReaderIcon className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                  )}

                  {data.type === "social" && (
                    <InstagramLogoIcon className="text-muted-foreground group-hover:text-indigo-600" />
                  )}
                </div>
              </TooltipTrigger>

              <TooltipContent>
                {data.type === "basic" && "External link"}
                {data.type === "social" && "Social link"}
                {data.type === "deployable" && "Deployable content"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <CardHeader className="space-y-2 px-4">
            <CardTitle>{data.displayText}</CardTitle>
            <CardDescription className="flex items-center gap-1">
              <Button variant="link" asChild>
                <Link
                  href={{
                    pathname: data.url,
                  }}
                  target="_blank"
                  className="text-muted-foreground hover:underline"
                >
                  {data.url}
                </Link>
              </Button>
            </CardDescription>
          </CardHeader>
        </section>

        <div
          className={cn(
            "absolute bottom-0 right-4 flex h-full w-10 flex-col items-center justify-center",
          )}
        >
          <LinkActions link={data} username={username} />
        </div>
      </Card>
    </EditLinkDrawer>
  );
});

LinkItem.displayName = "LinkItem";
