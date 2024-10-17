import { PaintBrush, UserCircle } from "@phosphor-icons/react";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from "~/components/ui/form";
import { GradientPicker } from "~/components/ui/gradient-picker";
import { Label } from "~/components/ui/label";
import { Divider } from "~/components/ui/separator";
import { UploadDropzone } from "~/lib/uploadthing";
import { cn } from "~/lib/utils";
import { type SaveNFCPreferences } from "~/server/api/schemas.zod";

export const OptionsSelector = () => {
  const form = useFormContext<SaveNFCPreferences>();
  const t = useTranslations("admin.onboarding.steps.cardPreferences");

  const cardVariant = form.watch("cardVariant");
  const hasCompanyLogo = form.watch("showCompanyLogo");
  const logoURL = form.watch("companyLogoURL");
  const selectedTemplate = form.watch("cardTemplate");
  const profilePicture = form.watch("profileImageUrl");

  if ((!selectedTemplate || !cardVariant) && cardVariant === "basic") {
    return;
  }

  return (
    <section
      className={cn(
        "mt-4 flex w-full flex-col gap-4 transition-transform",
        cardVariant === "custom" && "pointer-events-none mt-0 h-0 opacity-0",
      )}
    >
      <div className="space-y-1">
        <h3 className="text-lg font-medium">3. {t("details.title")}</h3>

        <p className="text-sm font-normal text-muted-foreground">{t("details.description")}</p>
      </div>

      <div className="grid w-full grid-cols-2 gap-4">
        <Alert
          variant="warning"
          className={cn("col-span-2 w-full", selectedTemplate !== "simple-logos" && "hidden")}
        >
          <ExclamationTriangleIcon />
          <AlertTitle>Warning: Tu foto de perfil debe tener un fondo transparente</AlertTitle>
          <AlertDescription>
            Caso contrario el color de fondo se verá en la tarjeta, lo que puede llevar a un diseño
            poco óptimo, puedes subir una imagen PNG con un fondo transparente o elegir un color de
            fondo apropiado con el selector de color.
          </AlertDescription>
        </Alert>

        <Alert
          variant="warning"
          className={cn("col-span-2 w-full", selectedTemplate === "simple-logos" && "hidden")}
        >
          <ExclamationTriangleIcon />
          <AlertTitle>Warning: El logo de la empresa debe tener fondo transparente</AlertTitle>
          <AlertDescription>
            Caso contrario el color de fondo se verá en la tarjeta, lo que puede llevar a un diseño
            poco óptimo, puedes subir una imagen PNG con un fondo transparente o elegir un color de
            fondo apropiado con el selector de color
          </AlertDescription>
        </Alert>

        <FormItem className={cn("col-span-2", selectedTemplate !== "simple-logos" && "hidden")}>
          <Label className="flex items-center gap-1 text-base">
            <UserCircle weight="duotone" className="size-6" />
            Foto de perfil
          </Label>

          <FormDescription className="text-sm">
            Utilizamos la misma imagen que añadiste a tu portal, si quieres cambiarla, puedes subir
            una distinta.
          </FormDescription>
        </FormItem>

        <article
          className={cn(
            "col-span-2 flex w-max flex-col gap-2 self-start rounded-lg bg-muted px-3 py-1 transition-all",
            selectedTemplate !== "simple-logos" && "hidden",
          )}
        >
          <section
            className={cn(
              "relative flex h-[140px] flex-col justify-center bg-contain bg-center bg-no-repeat",
            )}
            style={{
              backgroundImage: profilePicture ? `url(${profilePicture})` : undefined,
            }}
          >
            <UploadDropzone
              endpoint="avatars"
              className={cn(
                "z-10 mt-0 h-full w-full space-y-2 bg-transparent p-4 transition-all ut-button:h-9 ut-button:w-max ut-button:rounded-md ut-button:px-4 ut-button:text-sm ut-allowed-content:hidden ut-label:font-medium ut-label:text-foreground",
                profilePicture
                  ? "opacity-0 backdrop-blur-lg backdrop-filter duration-300 hover:opacity-100 ut-uploading:bg-indigo-50/50 ut-uploading:opacity-100"
                  : "opacity-100 hover:bg-indigo-50",
              )}
              onClientUploadComplete={async (files) => {
                files.map((file) => {
                  form.setValue("profileImageUrl", file.url);
                });
              }}
              config={{
                mode: "auto",
              }}
              content={{
                label: () => (
                  <span className="cursor-default rounded-sm bg-muted px-3 py-0.5 text-sm">
                    Upload a profile picture
                  </span>
                ),
                uploadIcon: () => <></>,
              }}
            />
          </section>

          <Button
            className="max-w-max self-center"
            variant="destructive_ghost"
            onClick={() => form.setValue("companyLogoURL", undefined)}
          >
            Eliminar foto
          </Button>
        </article>

        <Divider className="col-span-2 my-3">Opciones</Divider>

        <FormField
          control={form.control}
          name="showCompanyLogo"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-3">
                <FormControl>
                  <Checkbox
                    className="h-5 w-5"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>

                <FormLabel className="text-base">{t("details.companyLogo")}</FormLabel>
              </div>
            </FormItem>
          )}
        />

        <article
          className={cn(
            "col-span-2 flex w-max flex-col gap-2 rounded-lg bg-muted px-3 py-1 transition-all",
            !hasCompanyLogo && "pointer-events-none hidden h-0 opacity-0",
          )}
        >
          <section
            className={cn(
              "relative flex h-[140px] flex-col justify-center bg-contain bg-center bg-no-repeat",
            )}
            style={{
              backgroundImage: logoURL ? `url(${logoURL})` : undefined,
            }}
          >
            <UploadDropzone
              endpoint="logos"
              className={cn(
                "z-10 mt-0 h-full w-full space-y-2 bg-transparent p-4 transition-all ut-button:h-9 ut-button:w-max ut-button:rounded-md ut-button:px-4 ut-button:text-sm ut-allowed-content:hidden ut-label:font-medium ut-label:text-foreground",
                logoURL
                  ? "opacity-0 backdrop-blur-lg backdrop-filter duration-300 hover:opacity-100 ut-uploading:bg-indigo-50/50 ut-uploading:opacity-100"
                  : "opacity-100 hover:bg-indigo-50",
              )}
              onClientUploadComplete={async (files) => {
                files.map((file) => {
                  form.setValue("companyLogoURL", file.url);
                });
              }}
              config={{
                mode: "auto",
              }}
              content={{
                label: () => (
                  <span className="cursor-default rounded-sm bg-muted px-3 py-0.5 text-sm">
                    Upload a company logo
                  </span>
                ),
                uploadIcon: () => <></>,
              }}
            />
          </section>

          <Button
            className="max-w-max self-center"
            variant="destructive_ghost"
            onClick={() => form.setValue("companyLogoURL", undefined)}
          >
            {t("removeLogo")}
          </Button>
        </article>

        {!hasCompanyLogo && <div />}

        <FormField
          control={form.control}
          name="showName"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-3">
                <FormControl>
                  <Checkbox
                    className="h-5 w-5"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>

                <FormLabel className="text-base">{t("details.name")}</FormLabel>
              </div>
            </FormItem>
          )}
        />

        <FormField
          name="showJobTitle"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-3">
                <FormControl>
                  <Checkbox
                    className="h-5 w-5"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>

                <FormLabel className="text-base">{t("details.jobTitle")}</FormLabel>
              </div>
            </FormItem>
          )}
        />

        <FormField
          name="showCompanyName"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-3">
                <FormControl>
                  <Checkbox
                    className="h-5 w-5"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>

                <FormLabel className="text-base">{t("details.company")}</FormLabel>
              </div>
            </FormItem>
          )}
        />

        {selectedTemplate !== "edge-to-edge" && (
          <FormField
            control={form.control}
            name="includeQRCode"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-3">
                  <FormControl>
                    <Checkbox
                      className="h-5 w-5"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>

                  <FormLabel className="text-base">Incluir código QR</FormLabel>
                </div>
              </FormItem>
            )}
          />
        )}

        <Divider className="col-span-2 my-3">Colores</Divider>

        <Alert className="col-span-2 mb-2">
          <PaintBrush className="size-5" />
          <AlertTitle>Nota</AlertTitle>
          <AlertDescription>
            Si no seleccionas ningún color de fondo o color secundario, se utilizarán los colores
            predefinidos de la plantilla seleccionada.
          </AlertDescription>
        </Alert>

        <FormField
          control={form.control}
          name="cardColorFront"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Color frontal</FormLabel>
              <GradientPicker
                background={field.value}
                setBackground={field.onChange}
                hideImages
                hideGradients
              />
              <FormDescription>Color de fondo de la parte frontal de tu tarjeta</FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cardColorBack"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Color del reverso</FormLabel>
              <GradientPicker
                background={field.value}
                setBackground={field.onChange}
                hideImages
                hideGradients
              />
              <FormDescription>Color de fondo de la parte trasera de tu tarjeta</FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="accentColor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Color secundario</FormLabel>
              <GradientPicker
                background={field.value}
                setBackground={field.onChange}
                hideImages
                hideGradients
              />
              <FormDescription>
                Bordes, color del texto u otros detalles secundarios
              </FormDescription>
            </FormItem>
          )}
        />
      </div>
    </section>
  );
};
