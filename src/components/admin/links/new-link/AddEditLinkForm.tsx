"use client";

import { useAutoAnimate } from "@formkit/auto-animate/react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircledIcon,
  CrossCircledIcon,
  ExternalLinkIcon,
  FileTextIcon,
  LightningBoltIcon,
} from "@radix-ui/react-icons";
import { RadioGroupItem } from "@radix-ui/react-radio-group";
import { type TRPCError } from "@trpc/server";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Spinner } from "~/components/shared/Spinner";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { RadioGroup } from "~/components/ui/radio-group";
import { Switch } from "~/components/ui/switch";
import { Textarea } from "~/components/ui/textarea";
import { getAvailableLinkPosition, setAvailableLinkPosition } from "~/lib/cookies.actions";
import { positionsStore } from "~/lib/stores/positions";
import { UploadDropzone } from "~/lib/uploadthing";
import { cn } from "~/lib/utils";
import { newLinkSchema, type NewLinkSchema } from "~/server/db/schema";
import { api } from "~/trpc/react";

export function AddEditLinkForm({
  className,
  onClose,
  defaultValues,
  username,
}: {
  className?: string;
  onClose?: () => void;
  defaultValues?: NewLinkSchema;
  username: string;
}) {
  const isEditing = !!defaultValues;
  const t = useTranslations("admin.dashboard");

  const [parent] = useAutoAnimate();
  const setOptimisticItemPosition = positionsStore((s) => s.getPosition);

  const form = useForm<NewLinkSchema>({
    resolver: zodResolver(newLinkSchema),
    defaultValues: isEditing
      ? defaultValues
      : {
          type: "basic",
          displayText: "",
          url: "",
          position: Math.random() * 1000,
          description: "",
          buttonLabel: "",
          thumbnail: null,
        },
  });

  const isActive = !!form.watch("isActive");
  const isValidURL =
    !!form.watch("url")?.length && z.string().url().safeParse(form.watch("url")).success;
  const linkType = form.watch("type");
  const thumbnail = form.watch("thumbnail");

  const utils = api.useUtils();

  const editLink = api.links.edit.useMutation({
    onMutate: async (vars) => {
      void utils.links.all.cancel();

      form.reset({
        ...vars,
      });
    },
    onSuccess: async () => {
      form.reset();

      await Promise.all([
        utils.links.all.invalidate(),
        utils.viewer.previewPortal.invalidate(),
        utils.portals.get.invalidate({ username: username }),
      ]);
    },
    onError: (error) => {
      const e = error as unknown as TRPCError;
      toast.error(e.message);
    },
  });

  const newLink = api.links.new.useMutation({
    onMutate: async (vars) => {
      void utils.links.all.cancel();
      const prevData = utils.links.all.getData();

      const tempId = Math.random() * 1000;

      utils.links.all.setData(
        undefined,
        prevData?.concat([
          {
            id: tempId,
            displayText: vars.displayText ?? "Untitled link",
            url: vars.url ?? "",
            thumbnail: "",
            isActive: true,
            type: vars.type ?? "basic",
            layout: vars.layout ?? "basic",
            position: vars.position ?? 0,
            createdAt: new Date(),
            updatedAt: new Date(),
            userId: vars.userId ?? "",
            description: vars.description ?? null,
            buttonLabel: vars.buttonLabel ?? null,
            socialType: null,
          },
        ]),
      );

      onClose?.();
      return prevData;
    },
    onSuccess: async (data) => {
      toast.success("Link created!");
      form.reset();

      await Promise.all([
        utils.links.all.invalidate(),
        utils.viewer.previewPortal.invalidate(),
        utils.portals.get.invalidate({ username: username }),
        setAvailableLinkPosition(data?.position ?? 0),
      ]);
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    if (!isEditing) {
      const newPosition = await getAvailableLinkPosition();

      newLink.mutate({
        ...data,
        displayText: !data.displayText?.length ? "Untitled link" : data.displayText.trim(),
        position: parseInt(newPosition.data),
      });

      return;
    }

    if (!data.id) {
      return;
    }

    toast.promise(
      editLink.mutateAsync({
        ...data,
        displayText: !data.displayText?.length ? "Untitled link" : data.displayText.trim(),
        position: setOptimisticItemPosition(data.id),
      }),
      {
        loading: "Saving...",
        success: () => {
          onClose?.();
          return "Link updated!";
        },
        error: "Failed to update link",
      },
    );
  });

  useEffect(() => {
    if (defaultValues?.thumbnail ?? form.getValues().thumbnail) {
      form.setValue("thumbnail", defaultValues?.thumbnail ?? form.getValues().thumbnail);
    }
  }, [defaultValues?.thumbnail, form]);

  return (
    <Form {...form}>
      <div>
        <form onSubmit={handleSubmit} className={cn("flex flex-col gap-4", className)} ref={parent}>
          {isEditing && (
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem
                  className={cn(
                    "flex items-center justify-between gap-4 space-y-0 rounded-lg border border-dashed px-4 py-3",
                    !!field.value && "border-emerald-500 bg-emerald-50/50",
                  )}
                >
                  <FormLabel className="flex items-center gap-1">
                    {isActive ? t("editLinkModal.activeLink") : t("editLinkModal.inactiveLink")}
                    {isActive && <LightningBoltIcon className="text-amber-600" />}
                  </FormLabel>

                  <FormControl>
                    <Switch checked={field.value ?? false} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          )}

          <section className="relative flex h-40 justify-center gap-2">
            {thumbnail && (
              <div className="absolute z-0 h-40 w-full overflow-hidden rounded-lg">
                <Image
                  quality={50}
                  className="h-full w-full object-cover"
                  alt={`link-thumbnail`}
                  src={thumbnail}
                  width={320}
                  height={160}
                />
              </div>
            )}

            <UploadDropzone
              input={{ linkId: defaultValues?.id }}
              endpoint="thumbnails"
              className={cn(
                "z-10 mt-0 w-full space-y-2 bg-transparent p-4 transition-all ut-button:h-9 ut-button:w-max ut-button:rounded-md ut-button:px-4 ut-button:text-sm ut-allowed-content:hidden ut-label:font-medium ut-label:text-foreground",
                thumbnail
                  ? "opacity-0 backdrop-blur-lg backdrop-filter duration-300 hover:opacity-100 ut-uploading:bg-indigo-50/50 ut-uploading:opacity-100"
                  : "opacity-100 hover:bg-indigo-50",
              )}
              onClientUploadComplete={async (files) => {
                files.map((file) => {
                  form.setValue("thumbnail", file.url);
                });

                await utils.portals.get.refetch({ username: username });
              }}
              config={{
                mode: "auto",
              }}
              content={{
                label: () => (
                  <span className="cursor-default rounded-sm bg-muted px-3 py-0.5 text-sm">
                    {t("editLinkModal.uploadThumbnail")}
                  </span>
                ),
                uploadIcon: () => <></>,
              }}
            />
          </section>

          <FormField
            control={form.control}
            name="displayText"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("editLinkModal.displayText")}</FormLabel>

                <FormControl>
                  <Input placeholder="My website" {...field} value={field.value ?? ""} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            name="url"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <div className="flex h-5 items-center gap-1">
                  <FormLabel>{t("editLinkModal.url")}</FormLabel>

                  {isValidURL && (
                    <span className="rounded-full bg-green-100">
                      <CheckCircledIcon className="h-5 w-5 text-green-600" />
                    </span>
                  )}

                  {!isValidURL && !!form.watch("url")?.length && (
                    <span className="rounded-full bg-red-100">
                      <CrossCircledIcon className="h-5 w-5 text-destructive" />
                    </span>
                  )}
                </div>

                <FormControl>
                  <Input placeholder="https://example.com" {...field} value={field.value ?? ""} />
                </FormControl>

                <FormDescription>{t("editLinkModal.urlDescription")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="type"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("editLinkModal.type")}</FormLabel>

                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="grid grid-cols-2 gap-2"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <FormControl>
                        <RadioGroupItem
                          value="basic"
                          className="flex min-h-12 w-full items-center justify-center gap-2 rounded-md border border-border/50 text-sm transition-all duration-200 data-[state=checked]:border-indigo-500 data-[state=checked]:bg-indigo-50 data-[state=checked]:text-indigo-700"
                        >
                          <ExternalLinkIcon />
                          {t("editLinkModal.basic")}
                        </RadioGroupItem>
                      </FormControl>

                      <FormDescription>{t("editLinkModal.basicDescription")}</FormDescription>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                      <FormControl>
                        <RadioGroupItem
                          value="deployable"
                          className="flex min-h-12 w-full items-center justify-center gap-2 rounded-md border border-border/50 text-sm transition-all duration-200 data-[state=checked]:border-indigo-500 data-[state=checked]:bg-indigo-50 data-[state=checked]:text-indigo-700"
                        >
                          <FileTextIcon />
                          {t("editLinkModal.deployable")}
                        </RadioGroupItem>
                      </FormControl>

                      <FormDescription className="text-center">
                        {t("editLinkModal.deployableDescription")}
                      </FormDescription>
                    </div>
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />

          {linkType === "deployable" && (
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("editLinkModal.descriptionLabel")}</FormLabel>

                  <FormControl>
                    <Textarea
                      placeholder="https://example.com"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>

                  <FormDescription>{t("editLinkModal.descriptionText")}</FormDescription>
                </FormItem>
              )}
            />
          )}

          {linkType === "deployable" && (
            <FormField
              control={form.control}
              name="buttonLabel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("editLinkModal.buttonLabel")}</FormLabel>

                  <FormControl>
                    <Input
                      placeholder="See more!"
                      {...field}
                      value={field.value ?? ""}
                      className="max-w-[50%]"
                    />
                  </FormControl>

                  <FormDescription>{t("editLinkModal.buttonLabelDescription")}</FormDescription>
                </FormItem>
              )}
            />
          )}

          <Button
            size="lg"
            className="mt-4 w-full"
            disabled={form.formState.isSubmitting || editLink.isPending}
          >
            {form.formState.isSubmitting && <Spinner className="text-primary-foreground" />}
            {isEditing ? t("editLinkModal.save") : t("actions.addLink")}
          </Button>
        </form>
      </div>
    </Form>
  );
}
