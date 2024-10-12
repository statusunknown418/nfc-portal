import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "~/components/ui/dialog";
import { ZoomInIcon, ResetIcon, CrossCircledIcon, CheckCircledIcon } from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";
import { Button } from "~/components/ui/button";
import { useFormContext } from "react-hook-form";
import { Badge } from "~/components/ui/badge";
import { DialogHeader, DialogFooter } from "~/components/ui/dialog";
import { cn } from "~/lib/utils";
import {
  type SaveNFCPreferences,
  type CardTemplatesType,
  cardTemplates,
} from "~/server/api/schemas.zod";
import Image from "next/image";
import { nfcPreferencesStore } from "~/lib/stores/nfcPreferences";

export const CardTemplateModal = ({
  className,
  front,
  back,
  value,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
  front: string;
  back: string;
  value: string;
}) => {
  const form = useFormContext<SaveNFCPreferences>();
  const currentTemplate = form.watch("cardTemplate");
  const t = useTranslations("admin.onboarding.steps.cardPreferences");

  return (
    <Dialog modal>
      <DialogTrigger asChild>
        <button
          style={{
            ...style,
            backgroundImage: `url(${front})`,
          }}
          className={cn(
            "h-[160px] w-[280px] rounded-lg border bg-cover bg-center bg-no-repeat p-4 shadow-md transition-all hover:scale-105 hover:opacity-100",
            currentTemplate && "opacity-80",
            className,
          )}
        >
          <Badge size="lg">
            <ZoomInIcon className="h-5 w-5" />
            {t("templates.details")}
          </Badge>
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{t("templates.detailsTitle")}</DialogTitle>
        </DialogHeader>

        <section className="flex h-full min-h-max w-full items-center gap-2">
          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">{t("templates.front")}</p>

            <Image
              src={front}
              alt="front-template-design"
              width={350}
              height={200}
              className="rounded-lg border shadow-lg"
            />
          </div>

          <ResetIcon className="mt-4 h-5 w-5 text-muted-foreground" />

          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">{t("templates.back")}</p>
            <Image
              src={back}
              alt="back-template-design"
              width={350}
              height={200}
              className="rounded-lg border shadow-lg"
            />
          </div>
        </section>

        <p className="text-muted-foreground">
          Este es un ejemplo de como puede quedar esta plantilla luego de ser personalizada, luego
          de seleccionarla puedes cambiar el nombre, foto y otros detalles que se muestran.
        </p>

        <DialogFooter>
          <Button
            variant={currentTemplate === value ? "destructive_ghost" : "primary_ghost"}
            onClick={() => {
              if (currentTemplate === value) {
                form.setValue("cardTemplate", undefined);
              } else {
                form.setValue("cardTemplate", value as CardTemplatesType);
              }
            }}
          >
            {currentTemplate === value ? <CrossCircledIcon /> : <CheckCircledIcon />}
            {currentTemplate === value ? "Deselect" : "Select"}
          </Button>

          <DialogClose asChild>
            <Button variant="outline">{t("templates.close")}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
