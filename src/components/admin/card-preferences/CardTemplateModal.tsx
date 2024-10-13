import { CheckCircledIcon, CrossCircledIcon, ResetIcon, ZoomInIcon } from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useFormContext } from "react-hook-form";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { cn } from "~/lib/utils";
import { type CardTemplatesType, type SaveNFCPreferences } from "~/server/api/schemas.zod";

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
            "flex h-[170px] w-[280px] flex-col items-center justify-center rounded-lg border bg-cover bg-center bg-no-repeat p-4 shadow-md transition-all hover:scale-105 hover:opacity-100",
            currentTemplate && "opacity-80",
            className,
          )}
        >
          <Badge className="border-dashed border-neutral-500 bg-indigo-600/50 backdrop-blur-sm">
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
              className={cn("rounded-lg shadow-lg")}
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
              className={cn("rounded-lg shadow-lg")}
            />
          </div>
        </section>

        <p className="text-muted-foreground">
          Estas son imágenes referenciales del producto final al seleccionar esta plantilla y luego
          de ser personalizada, los datos mostrados son pre-configurados con la información de tu
          contacto que añadiste en el paso anterior.
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
