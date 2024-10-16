"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FloppyDisk, Spinner } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type z } from "zod";
import { useAutoSaveFormData } from "~/lib/hooks/use-auto-save";
import { UploadDropzone } from "~/lib/uploadthing";
import { cn } from "~/lib/utils";
import { editViewerContactSchema } from "~/server/api/schemas.zod";
import { api, type RouterOutputs } from "~/trpc/react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

export const PersonalInfoForm = ({
  initialData,
}: {
  initialData: RouterOutputs["vCard"]["get"];
}) => {
  const utils = api.useUtils();

  const { data } = api.vCard.get.useQuery(undefined, { initialData });
  const { mutate, isPending } = api.vCard.edit.useMutation({
    onSuccess: async () => {
      toast.success("Information saved!");

      await Promise.all([utils.vCard.get.refetch(), utils.viewer.previewPortal.invalidate()]);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const [avatar, setAvatar] = useState(initialData?.image);

  const form = useForm<z.infer<typeof editViewerContactSchema>>({
    resolver: zodResolver(editViewerContactSchema),
    defaultValues: data?.contactJSON
      ? {
          name: {
            first: data.contactJSON.name.first ?? "",
            last: data.contactJSON.name.last ?? "",
          },
        }
      : {
          name: {
            first: "",
            last: "",
          },
        },
  });

  const t = useTranslations("admin.onboarding.steps.contact");
  const visual = useTranslations("admin.onboarding.steps.portal");
  const bioCharacters = form.watch("bio")?.length ?? 0;

  const onSubmit = async (data: z.infer<typeof editViewerContactSchema>) => {
    mutate(data);
  };

  useAutoSaveFormData(500, form, (data) => void onSubmit(data), []);

  return (
    <>
      <article className="w-full">
        <h3 className="text-2xl font-semibold tracking-wide">Información de contacto</h3>
        <p className="mt-1 text-muted-foreground">
          El primer paso es que nos cuentes un poco sobre ti.
        </p>
      </article>

      <Form {...form}>
        <form
          className="relative flex w-full flex-col gap-4 rounded-t-xl border p-6"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <Alert variant="indigo">
            <FloppyDisk size={16} />

            <AlertTitle>{t("autosave")}</AlertTitle>
            <AlertDescription>
              <p>{t("autosaveDescription")}</p>

              {isPending && (
                <Badge variant="outline" className="absolute right-4 top-2 h-7 animate-pulse">
                  <Spinner className="mr-2 animate-spin" />
                  Saving ...
                </Badge>
              )}
            </AlertDescription>
          </Alert>

          <section className="flex flex-col justify-between gap-6 md:flex-row md:gap-8">
            <article className="flex flex-col gap-2 rounded-lg">
              <h2 className="font-medium">Avatar</h2>

              <section className="relative flex h-[200px] w-[200px] justify-center gap-2">
                {avatar && (
                  <div
                    className={cn(
                      "absolute z-0 h-[200px] w-[200px] overflow-hidden rounded-lg border",
                    )}
                  >
                    <Image fill className="object-cover" alt={`profile-avatar`} src={avatar} />
                  </div>
                )}

                <UploadDropzone
                  endpoint="avatars"
                  className={cn(
                    "z-10 mt-0 w-full space-y-2 bg-transparent p-4 transition-all ut-button:h-9 ut-button:w-max ut-button:rounded-md ut-button:px-4 ut-button:text-sm ut-allowed-content:hidden ut-label:font-medium ut-label:text-foreground",
                    avatar
                      ? "opacity-0 backdrop-blur-lg backdrop-filter duration-300 hover:opacity-100 ut-uploading:bg-indigo-50/50 ut-uploading:opacity-100"
                      : "opacity-100 hover:bg-indigo-50",
                  )}
                  onClientUploadComplete={(files) => {
                    files.map((f) => {
                      setAvatar(f.url);
                    });

                    void utils.viewer.previewPortal.invalidate();
                  }}
                  config={{
                    mode: "auto",
                  }}
                  content={{
                    label: () => (
                      <span className="cursor-default rounded-sm bg-muted px-3 py-0.5 text-sm">
                        {visual("avatarUpload")}
                      </span>
                    ),
                  }}
                />
              </section>

              <ul className="flex w-full flex-col gap-2">
                <Button variant="outline" type="button" className="w-full">
                  {visual("generated")}
                </Button>

                <Button
                  variant="destructive_ghost"
                  type="button"
                  className="w-full border-destructive/50 bg-destructive/10 hover:bg-destructive/20"
                >
                  {visual("remove")}
                </Button>
              </ul>
            </article>

            <article className="flex flex-grow flex-col gap-6">
              <FormField
                control={form.control}
                name="name.first"
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormLabel>{t("firstName")}</FormLabel>

                    <FormControl>
                      <Input autoComplete="given-name" {...field} />
                    </FormControl>

                    <FormDescription>
                      Puedes decidir si añades más de un nombre o no
                    </FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name.last"
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormLabel>{t("lastName")}</FormLabel>

                    <FormControl>
                      <Input autoComplete="family-name" {...field} />
                    </FormControl>

                    <FormDescription>No es obligatorio añadir un apellido</FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>{visual("bio")}</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={3}
                        value={field.value ?? ""}
                        className="resize-none"
                        placeholder="I try to build cool stuff without breaking it..."
                      />
                    </FormControl>

                    <FormDescription>
                      {visual("bioDescription")}
                      <span
                        className={cn(
                          "ml-1 text-foreground",
                          bioCharacters > 100 && "text-destructive",
                        )}
                      >
                        ({bioCharacters}/100 caracteres máximos.)
                      </span>
                    </FormDescription>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </article>
          </section>
        </form>
      </Form>
    </>
  );
};
