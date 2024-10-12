import { UploadIcon } from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";
import { Suspense } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { Button } from "~/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";
import {
  PageEnabledWrapperLoader,
  PageEnabledWrapperRSC,
} from "../enabled-banner/page-enabled-wrapper";
import { LinksWrapperLoader, LinksWrapperRSC } from "./links-list/links-wrapper";
import { NewLinkDrawer } from "./new-link";
import { AddSocialLinks } from "./social-links";

export const LinksViewRSC = ({ jwt }: { jwt: CustomJwtSessionClaims }) => {
  const t = useTranslations("admin.dashboard");
  const common = useTranslations("common");

  return (
    <div className="flex flex-col items-center gap-4">
      <Breadcrumb className="self-start">
        <BreadcrumbList>
          <BreadcrumbItem>{t("navigation.crumbOne")}</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbPage>{t("navigation.crumbTwo")}</BreadcrumbPage>
        </BreadcrumbList>
      </Breadcrumb>

      <Suspense fallback={<PageEnabledWrapperLoader />}>
        <PageEnabledWrapperRSC />
      </Suspense>

      <article className="mt-4 flex w-full flex-col gap-2 sm:flex-row sm:items-center">
        <AddSocialLinks username={jwt.username} />

        <div className="flex items-center gap-2">
          <NewLinkDrawer username={jwt.username} />

          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Button size="iconXl" variant="outline" className="opacity-50">
                  <UploadIcon />
                </Button>
              </TooltipTrigger>

              <TooltipContent className="text-sm">
                {common("comingSoon")}{" "}
                <Button variant="link" className="text-sm">
                  {common("requestAction")}
                </Button>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </article>

      <article className="mt-2 flex h-full w-full flex-col gap-4">
        <Suspense fallback={<LinksWrapperLoader />}>
          <LinksWrapperRSC />
        </Suspense>
      </article>
    </div>
  );
};
