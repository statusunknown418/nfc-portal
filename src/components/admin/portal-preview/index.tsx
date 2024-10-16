import { auth } from "@clerk/nextjs/server";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Spinner } from "~/components/shared/Spinner";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Badge } from "~/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";
import { api } from "~/trpc/server";
import { PortalPreview } from "./PortalPreview";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export const PortalPreviewWrapperRSC = async ({
  username,
  hideAlerts = false,
  className,
}: {
  username: string;
  hideAlerts?: boolean;
  className?: string;
}) => {
  const portal = await api.viewer.previewPortal();
  const bypassKey = auth().userId;

  if (!portal || !bypassKey) {
    return (
      <Alert>
        <AlertTitle>Something happened</AlertTitle>

        <Button variant="ghost">Reload</Button>

        <AlertDescription>
          Contact support here{" "}
          <Link href="mailto:help@stackkstudios.com">help@stackkstudios.com</Link>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div
      className={cn(
        "flex h-max flex-col items-center justify-center gap-4 rounded-xl md:fixed md:top-40",
        className,
      )}
    >
      {!portal?.hasPurchasedCard && !hideAlerts && (
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="destructive" size="lg">
                <InfoCircledIcon className="h-5 w-5" />
                Portal Inactive
              </Badge>
            </TooltipTrigger>

            <TooltipContent className="text-sm">
              You need to purchase one of our cards to activate and share your portal!
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      <article
        id="portal-device-preview"
        className="relative h-full max-h-[740px] min-h-[640px] w-full min-w-[330px] max-w-[330px] self-center justify-self-center overflow-hidden overscroll-y-contain rounded-[52px] border-[6px] border-primary/80 shadow-lg shadow-black"
      >
        <PortalPreview initialData={portal} username={username} bypassKey={bypassKey} />
      </article>

      <div className="mt-2 flex flex-col items-center justify-center text-center tracking-wide text-muted-foreground">
        {portal?.hasPageActive ? (
          <h3>Preview</h3>
        ) : (
          <>
            <p className="text-sm font-medium not-italic">Preview purposes only</p>
          </>
        )}
      </div>
    </div>
  );
};

export const PortalPreviewWrapperLoader = () => {
  return (
    <article
      id="portal-device-preview"
      className="fixed top-40 flex h-[640px] w-[330px] items-center justify-center rounded-[40px] border-4 shadow-lg"
    >
      <Spinner />
    </article>
  );
};
