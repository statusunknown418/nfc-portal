import { zodResolver } from "@hookform/resolvers/zod";
import { FloppyDisk } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer";
import { Form, FormDescription, FormField, FormItem, FormLabel } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { useMediaQuery } from "~/lib/hooks/use-media-query";
import { PrettySocialIcons } from "~/lib/utils";
import { newLinkSchema, type NewLinkSchema } from "~/server/db/schema";
import { api, type RouterOutputs } from "~/trpc/react";
import { socialLinks } from "./SocialLInksForm";
import { Spinner } from "~/components/shared/Spinner";

export const EditSocialLink = ({
  children,
  linkData,
  userName,
}: {
  children: ReactNode;
  linkData: RouterOutputs["links"]["all"][number];
  userName: string;
}) => {
  const t = useTranslations();
  const [open, setOpen] = useState(false);

  const isMobile = useMediaQuery("(max-width: 768px)");

  const form = useForm<NewLinkSchema>({
    resolver: zodResolver(newLinkSchema.refine((s) => s.displayText !== "")),
    defaultValues: {
      displayText: linkData.displayText,
      url: linkData.url,
      socialType: linkData.socialType,
    },
  });

  const utils = api.useUtils();

  const editLink = api.links.edit.useMutation({
    onMutate: async (vars) => {
      void utils.links.all.cancel();

      form.reset({
        ...vars,
      });
    },
    onSuccess: async () => {
      await Promise.all([
        utils.links.all.invalidate(),
        utils.viewer.previewPortal.invalidate(),
        utils.portals.get.invalidate({ username: userName }),
      ]);

      setOpen(false);
    },
  });

  const onSubmit = (data: NewLinkSchema) => {
    const buildUrl = socialLinks
      .find((link) => link.key === data.socialType)
      ?.url(data.displayText ?? "");

    toast.promise(
      editLink.mutateAsync({
        ...data,
        id: linkData.id,
        url: buildUrl,
      }),
      {
        loading: "Saving...",
        success: () => {
          setOpen(false);
          return "Link actualizado!";
        },
        error: "Oops, hubo un error",
      },
    );
  };

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{children}</DrawerTrigger>

        <Form {...form}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Editar red social</DrawerTitle>
            </DrawerHeader>

            <div className="mx-4 my-2 flex w-max flex-col gap-2 rounded-lg border bg-secondary px-8 py-6">
              {linkData.socialType && (
                <PrettySocialIcons type={linkData.socialType} className="size-16" />
              )}

              <h2 className="font-medium capitalize">{linkData.socialType}</h2>
            </div>

            <form className="mt-2 px-4" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                name="displayText"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tu usuario (handle, username, etc)</FormLabel>
                    <div className="flex h-11 items-center">
                      <p className="flex h-full items-center rounded-l-lg border border-r-0 bg-muted px-4 text-sm text-muted-foreground">
                        {socialLinks.find((link) => link.key === linkData.socialType)?.url("")}
                      </p>

                      <Input
                        {...field}
                        value={field.value ?? ""}
                        className="h-11 rounded-l-none"
                        placeholder={`@someone`}
                      />
                    </div>
                    <FormDescription>
                      Asegúrate de escribir el nombre de usuario correcto
                    </FormDescription>
                  </FormItem>
                )}
              />
            </form>

            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline" size="lg" type="button">
                  Cancelar
                </Button>
              </DrawerClose>

              <Button variant="primary_ghost" size="lg" type="submit">
                <FloppyDisk />
                Guardar
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Form>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <Form {...form}>
        <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Editar red social</DialogTitle>
          </DialogHeader>

          <div className="my-2 flex w-max flex-col gap-2 rounded-lg border bg-secondary px-8 py-6">
            {linkData.socialType && (
              <PrettySocialIcons type={linkData.socialType} className="size-16" />
            )}

            <h2 className="font-medium capitalize">{linkData.socialType}</h2>
          </div>

          <form className="mt-2" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name="displayText"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tu usuario (handle, username, etc)</FormLabel>
                  <div className="flex h-11 items-center">
                    <p className="flex h-full items-center rounded-l-lg border border-r-0 bg-muted px-4 text-sm text-muted-foreground">
                      {socialLinks.find((link) => link.key === linkData.socialType)?.url("")}
                    </p>

                    <Input
                      {...field}
                      value={field.value ?? ""}
                      className="h-11 rounded-l-none"
                      placeholder={`@someone`}
                    />
                  </div>
                  <FormDescription>
                    Asegúrate de escribir el nombre de usuario correcto
                  </FormDescription>
                </FormItem>
              )}
            />
          </form>

          <DialogFooter>
            <Button variant="outline" type="button">
              Cancelar
            </Button>

            <Button
              variant="primary_ghost"
              type="submit"
              disabled={form.formState.isSubmitting || editLink.isPending}
            >
              {editLink.isPending ? <Spinner /> : <FloppyDisk />}
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Form>
    </Dialog>
  );
};
