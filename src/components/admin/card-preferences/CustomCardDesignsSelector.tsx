import { ResetIcon } from "@radix-ui/react-icons";
import { UploadDropzone } from "~/lib/uploadthing";
import { useTranslations } from "next-intl";
import { Button } from "../../ui/button";
import { useFormContext } from "react-hook-form";
import { Label } from "~/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "~/components/ui/alert";
import { cn } from "~/lib/utils";
import { type SaveNFCPreferences } from "~/server/api/schemas.zod";

export const CustomCardDesignsSelector = () => {
  const form = useFormContext<SaveNFCPreferences>();
  const t = useTranslations("admin.onboarding.steps.cardPreferences");
  const cardVariant = form.watch("cardVariant");
  const imageFront = form.watch("cardImageFront");
  const imageBack = form.watch("cardImageBack");
  const selectedTemplate = form.watch("cardTemplate");

  if (form.watch("cardVariant") === "basic" && selectedTemplate === undefined) {
    return;
  }

  return (
    <div
      className={cn(
        "mt-2 flex max-w-max flex-col gap-4 rounded-lg",
        cardVariant !== "custom" && "pointer-events-none mt-0 h-0 opacity-0",
      )}
    >
      <h3 className="text-lg font-medium">2. Añade tus diseños personalizados</h3>

      <Alert variant="warning" className="my-1 max-w-lg">
        <AlertTitle>{t("banners.headsUp.title")}</AlertTitle>

        <AlertDescription>{t("banners.headsUp.description")}</AlertDescription>
      </Alert>

      <article
        className={cn(
          "mt-2 flex w-full flex-grow flex-col gap-2 transition-all",
          cardVariant !== "custom" && "pointer-events-none mt-0 h-0 opacity-0",
        )}
      >
        <Label className="flex items-center gap-2">
          <ResetIcon className="rotate-180" />
          {t("frontDesign")}
        </Label>

        <section
          className={cn(
            "relative flex h-[240px] w-[420px] flex-col justify-center bg-contain bg-center bg-no-repeat",
          )}
          style={{
            backgroundImage: `url(${imageFront})`,
          }}
        >
          <UploadDropzone
            endpoint="logos"
            className={cn(
              "z-10 mt-0 h-full w-full space-y-2 bg-transparent p-4 transition-all ut-button:h-9 ut-button:w-max ut-button:rounded-md ut-button:px-4 ut-button:text-sm ut-allowed-content:hidden ut-label:font-medium ut-label:text-foreground",
              imageFront
                ? "opacity-0 backdrop-blur-lg backdrop-filter duration-300 hover:opacity-100 ut-uploading:bg-indigo-50/50 ut-uploading:opacity-100"
                : "opacity-100 hover:bg-indigo-50",
            )}
            onClientUploadComplete={async (files) => {
              files.map((file) => {
                form.setValue("cardImageFront", file.url);
              });
            }}
            config={{
              mode: "auto",
            }}
            content={{
              label: () => (
                <span className="cursor-default rounded-sm bg-muted px-3 py-0.5 text-sm">
                  1050x600 pixels for the best quality
                </span>
              ),
              uploadIcon: () => <></>,
            }}
          />
        </section>

        <Button
          variant="destructive_ghost"
          size="sm"
          className="w-max self-center"
          onClick={() => form.setValue("cardImageFront", undefined)}
        >
          {t("removeDesign")}
        </Button>
      </article>

      <article
        className={cn(
          "relative flex w-full flex-grow flex-col gap-2 transition-all",
          cardVariant !== "custom" && "pointer-events-none mt-0 h-0 opacity-0",
        )}
      >
        <Label className="flex items-center gap-2">
          <ResetIcon />
          {t("backDesign")}
        </Label>

        <section
          className={cn(
            "relative flex h-[240px] w-[420px] flex-col justify-center bg-contain bg-center bg-no-repeat",
          )}
          style={{
            backgroundImage: `url(${imageBack})`,
          }}
        >
          <UploadDropzone
            endpoint="logos"
            className={cn(
              "z-10 mt-0 h-full w-full space-y-2 bg-transparent p-4 transition-all ut-button:h-8 ut-button:w-max ut-button:rounded-md ut-button:px-4 ut-button:text-sm ut-allowed-content:hidden ut-label:font-medium ut-label:text-foreground",
              imageBack
                ? "opacity-0 backdrop-blur-lg backdrop-filter duration-300 hover:opacity-100 ut-uploading:bg-indigo-50/50 ut-uploading:opacity-100"
                : "opacity-100 hover:bg-indigo-50",
            )}
            onClientUploadComplete={async (files) => {
              files.map((file) => {
                form.setValue("cardImageBack", file.url);
              });
            }}
            config={{
              mode: "auto",
            }}
            content={{
              label: () => (
                <span className="cursor-default rounded-sm bg-muted px-3 py-0.5 text-sm">
                  1050x600 pixels for the best quality
                </span>
              ),
              uploadIcon: () => <></>,
            }}
          />
        </section>

        <Button
          variant="destructive_ghost"
          size="sm"
          className="w-max self-center"
          onClick={() => {
            form.setValue("cardImageBack", undefined);
          }}
        >
          {t("removeDesign")}
        </Button>
      </article>
    </div>
  );
};
