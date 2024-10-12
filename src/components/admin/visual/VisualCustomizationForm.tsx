"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FontBoldIcon, FontFamilyIcon, FontItalicIcon, FontRomanIcon } from "@radix-ui/react-icons";
import { RadioGroupItem as RadixRadioGroupItem } from "@radix-ui/react-radio-group";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
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
import { GradientPicker } from "~/components/ui/gradient-picker";
import { Label } from "~/components/ui/label";
import { RadioGroup } from "~/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { useAutoSaveFormData } from "~/lib/hooks/use-auto-save";
import { UploadDropzone } from "~/lib/uploadthing";
import { cn } from "~/lib/utils";
import {
  editVisualCustomizationSchema,
  type EditVisualCustomizationSchema,
} from "~/server/db/schema";
import { api, type RouterOutputs } from "~/trpc/react";

export const VisualCustomizationForm = ({
  defaultValues,
  username,
}: {
  defaultValues: RouterOutputs["visuals"]["get"];
  username: string;
}) => {
  const form = useForm<EditVisualCustomizationSchema>({
    defaultValues: {
      ...defaultValues,
      bio: defaultValues?.bio ?? "",
    },
    resolver: zodResolver(editVisualCustomizationSchema),
  });

  const bioCharacters = form.watch("bio")?.length ?? 0;
  const utils = api.useUtils();
  const t = useTranslations("admin.onboarding.steps.portal");

  const mutate = api.visuals.edit.useMutation({
    onSuccess: () => {
      void utils.viewer.previewPortal.invalidate();
      void utils.portals.get.invalidate({ username: username });
    },
  });

  const [enableCustom] = useState(defaultValues?.theme.themeKey === "custom" || false);
  const [avatar, setAvatar] = useState(defaultValues?.image);
  const [avatarShape] = useState(defaultValues?.avatarShape);

  const handleSubmit = async (data: EditVisualCustomizationSchema) => {
    toast.promise(mutate.mutateAsync(data), {
      loading: "Saving...",
      success: "Done!",
      error: (err) => `Failed to save: ${err}`,
    });
  };

  useAutoSaveFormData(500, form, (data) => void handleSubmit(data), []);

  return (
    <Form {...form}>
      <form className="mt-2 grid grid-cols-1 gap-6">
        <Alert variant="indigo" className="border-dashed">
          <AlertTitle>{t("themes")}</AlertTitle>

          <AlertDescription>{t("themesMessage")}</AlertDescription>
        </Alert>

        <section className="flex flex-col justify-between gap-6 rounded-lg border px-6 *:py-6 md:flex-row md:gap-8">
          <article className="flex flex-col gap-4 rounded-lg">
            <h2 className="text-lg font-semibold">Avatar</h2>

            <section className="relative flex h-[200px] w-[200px] justify-center gap-2">
              {avatar && (
                <div
                  className={cn(
                    "absolute z-0 h-[200px] w-[200px] overflow-hidden rounded-lg border",
                    {
                      "self-center rounded-full": avatarShape === "circle",
                      "self-center rounded-none": avatarShape === "square",
                    },
                  )}
                >
                  <Image
                    fill
                    className="object-cover"
                    placeholder="blur"
                    alt={`profile-avatar`}
                    src={avatar}
                  />
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
                      {t("avatarUpload")}
                    </span>
                  ),
                }}
              />
            </section>

            <ul className="flex w-full flex-col gap-2">
              <Button variant="outline" type="button" className="w-full">
                {t("generated")}
              </Button>

              <Button
                variant="destructive_ghost"
                type="button"
                className="w-full border-destructive/50 bg-destructive/10 hover:bg-destructive/20"
              >
                {t("remove")}
              </Button>
            </ul>
          </article>

          <article className="flex flex-grow flex-col gap-4">
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-lg font-semibold">{t("bio")}</FormLabel>
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
                    {t("bioDescription")}
                    <span
                      className={cn(
                        "ml-1 text-foreground",
                        bioCharacters > 100 && "text-destructive",
                      )}
                    >
                      ({bioCharacters}/100 characters max.)
                    </span>
                  </FormDescription>

                  <FormMessage />
                </FormItem>
              )}
            />
          </article>
        </section>

        <section
          className={cn(
            "flex translate-y-0 flex-col gap-4 rounded-lg border p-6 transition-transform duration-300",
            {
              "h-0 translate-y-10 opacity-0": !enableCustom,
            },
          )}
        >
          <h2 className="text-lg font-semibold">{t("themeCustomization.colors.title")}</h2>

          <article className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="theme.colors.background"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("themeCustomization.colors.background")}</FormLabel>

                  <GradientPicker background={field.value} setBackground={field.onChange} />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="theme.colors.foreground"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("themeCustomization.colors.textColor")}</FormLabel>

                  <GradientPicker background={field.value} setBackground={field.onChange} />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="theme.colors.subtle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("themeCustomization.colors.accent")}</FormLabel>

                  <GradientPicker background={field.value} setBackground={field.onChange} />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="theme.colors.border"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("themeCustomization.colors.border")}</FormLabel>

                  <GradientPicker background={field.value} setBackground={field.onChange} />
                </FormItem>
              )}
            />
          </article>
        </section>

        <section
          className={cn(
            "flex translate-y-0 flex-col gap-4 rounded-lg border p-6 transition-transform duration-300",
            {
              "h-0 translate-y-10 opacity-0": !enableCustom,
            },
          )}
        >
          <h2 className="text-lg font-semibold">{t("themeCustomization.buttons.title")}</h2>

          <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="theme.buttons.background"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("themeCustomization.buttons.background")}</FormLabel>

                  <GradientPicker background={field.value} setBackground={field.onChange} />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="theme.buttons.textColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("themeCustomization.buttons.textColor")}</FormLabel>

                  <GradientPicker background={field.value} setBackground={field.onChange} />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="theme.buttons.borderColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("themeCustomization.buttons.borderColor")}</FormLabel>

                  <GradientPicker background={field.value ?? ""} setBackground={field.onChange} />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="theme.buttons.borderStyle"
              render={({ field }) => (
                <FormItem className="max-w-[240px]">
                  <FormLabel>{t("themeCustomization.buttons.borderStyle")}</FormLabel>

                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="solid">
                        {t("themeCustomization.buttons.styles.solid")}
                      </SelectItem>
                      <SelectItem value="dashed">
                        {t("themeCustomization.buttons.styles.dashed")}
                      </SelectItem>
                      <SelectItem value="dotted">
                        {t("themeCustomization.buttons.styles.dotted")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </section>

          <article className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <FormField
              control={form.control}
              name="theme.buttons.fontWeight"
              render={({ field }) => (
                <FormItem className="max-w-[240px]">
                  <Label>{t("themeCustomization.fonts.weight")}</Label>

                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="100">
                        <FontFamilyIcon />
                        {t("themeCustomization.fonts.weights.thin")}
                      </SelectItem>
                      <SelectItem value="300">
                        <FontFamilyIcon />
                        {t("themeCustomization.fonts.weights.light")}
                      </SelectItem>

                      <SelectItem value="normal">
                        <FontFamilyIcon />
                        {t("themeCustomization.fonts.weights.normal")}
                      </SelectItem>

                      <SelectItem value="500">
                        <FontBoldIcon />
                        {t("themeCustomization.fonts.weights.medium")}
                      </SelectItem>

                      <SelectItem value="bold">
                        <FontBoldIcon />
                        {t("themeCustomization.fonts.weights.bold")}
                      </SelectItem>

                      <SelectItem value="900">
                        <FontBoldIcon />
                        {t("themeCustomization.fonts.weights.black")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="theme.buttons.fontStyle"
              render={({ field }) => (
                <FormItem className="max-w-[240px]">
                  <Label>{t("themeCustomization.fonts.style")}</Label>

                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="normal">
                        <FontRomanIcon />
                        {t("themeCustomization.fonts.styles.normal")}
                      </SelectItem>

                      <SelectItem value="italic">
                        <FontItalicIcon />
                        {t("themeCustomization.fonts.styles.italic")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </article>

          <FormField
            control={form.control}
            name="theme.buttons.variant"
            render={({ field }) => (
              <FormItem>
                <Label>{t("themeCustomization.buttons.shape.label")}</Label>

                <RadioGroup
                  className="flex flex-wrap items-center gap-4 pt-2"
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <RadixRadioGroupItem
                    value="pill"
                    className="flex h-10 items-center justify-center gap-2 rounded-full border bg-muted px-8 text-sm ring-offset-2 transition-all duration-200 data-[state=checked]:ring data-[state=checked]:ring-ring"
                  >
                    {t("themeCustomization.buttons.shape.pill")}
                  </RadixRadioGroupItem>

                  <FormControl>
                    <RadixRadioGroupItem
                      value="rounded"
                      className="flex h-10 items-center justify-center gap-2 rounded-xl border bg-muted px-8 text-sm ring-offset-2 transition-all duration-200 data-[state=checked]:ring data-[state=checked]:ring-ring"
                    >
                      {t("themeCustomization.buttons.shape.rounded")}
                    </RadixRadioGroupItem>
                  </FormControl>

                  <FormControl>
                    <RadixRadioGroupItem
                      value="small-radius"
                      className="flex h-10 items-center justify-center gap-2 rounded-sm border bg-muted px-8 text-sm ring-offset-2 transition-all duration-200 data-[state=checked]:ring data-[state=checked]:ring-ring"
                    >
                      {t("themeCustomization.buttons.shape.small")}
                    </RadixRadioGroupItem>
                  </FormControl>

                  <p className="text-muted-foreground">or</p>

                  <FormControl>
                    <RadixRadioGroupItem
                      value="square"
                      className="flex h-10 items-center justify-center gap-2 border bg-muted px-8 text-sm ring-offset-2 transition-all duration-200 data-[state=checked]:ring data-[state=checked]:ring-ring"
                    >
                      {t("themeCustomization.buttons.shape.square")}
                    </RadixRadioGroupItem>
                  </FormControl>
                </RadioGroup>
              </FormItem>
            )}
          />
        </section>
      </form>
    </Form>
  );
};
