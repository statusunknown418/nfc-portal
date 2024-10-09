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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";
import {
  ContactDataLoading,
  ContactDataWrapper,
} from "../contact/contact-data/contact-data-wrapper";
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

      <Tabs defaultValue="links" className="relative mt-4 flex w-full flex-col gap-2">
        <TabsList className="h-[44px] w-max justify-start rounded-full border border-primary/20">
          <TabsTrigger
            value="contact"
            className="h-[36px] min-w-32 flex-grow rounded-full border border-transparent data-[state=active]:border-indigo-500 data-[state=active]:bg-indigo-100 data-[state=active]:font-semibold data-[state=active]:text-indigo-600"
          >
            {t("tabs.contact")}
          </TabsTrigger>

          <TabsTrigger
            value="links"
            className="h-[36px] min-w-32 flex-grow rounded-full border border-transparent data-[state=active]:border-indigo-500 data-[state=active]:bg-indigo-100 data-[state=active]:font-semibold data-[state=active]:text-indigo-600"
          >
            {t("tabs.links")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="links">
          <article className="flex flex-col gap-2 sm:flex-row sm:items-center">
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

          {/* <Alert variant="success" className="flex gap-4 p-4">
            <Switch />

            <div>
              <AlertTitle className="text-primary">
                Include all your links in contact information
              </AlertTitle>

              <AlertDescription className="mt-1 text-muted-foreground">
                When enabled your contact information (vCard) will contain all the links you add
                here.
              </AlertDescription>
            </div>
          </Alert> */}

          <article className="mt-4 flex h-full w-full flex-col gap-4">
            <Suspense fallback={<LinksWrapperLoader />}>
              <LinksWrapperRSC />
            </Suspense>
          </article>
        </TabsContent>

        <TabsContent value="contact">
          <Suspense fallback={<ContactDataLoading />}>
            <ContactDataWrapper />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
};
