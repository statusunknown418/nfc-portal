"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FontBoldIcon, FontFamilyIcon, FontItalicIcon, FontRomanIcon } from "@radix-ui/react-icons";
import { RadioGroupItem as RadixRadioGroupItem } from "@radix-ui/react-radio-group";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Form, FormControl, FormField, FormItem, FormLabel } from "~/components/ui/form";
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
import { useAutoSaveFormData } from "~/lib/hooks/use-auto-save";
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

  const utils = api.useUtils();
  const t = useTranslations("admin.onboarding.steps.portal");

  const mutate = api.visuals.edit.useMutation({
    onSuccess: () => {
      void utils.viewer.previewPortal.invalidate();
      void utils.portals.get.invalidate({ username: username });
    },
  });

  const [enableCustom] = useState(defaultValues?.theme.themeKey === "custom" || false);

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

        {/*  */}

        <section
          className={cn(
            "flex translate-y-0 flex-col gap-4 rounded-lg border p-6 transition-transform duration-300",
            {
              "h-0 translate-y-10 opacity-0": !enableCustom,
            },
          )}
        >
          <h2 className="text-lg font-semibold">{t("themeCustomization.colors.title")}</h2>

          <article className="grid grid-cols-1 gap-x-5 gap-y-8 md:grid-cols-2">
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
          <h2 className="text-lg font-semibold">Botón principal [Guardar contacto]</h2>

          <section className="grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2">
            <FormField
              control={form.control}
              name="theme.buttons.saveContactButton.background"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("themeCustomization.buttons.background")}</FormLabel>

                  <GradientPicker background={field.value} setBackground={field.onChange} />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="theme.buttons.saveContactButton.textColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("themeCustomization.buttons.textColor")}</FormLabel>

                  <GradientPicker background={field.value} setBackground={field.onChange} />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="theme.buttons.saveContactButton.borderColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("themeCustomization.buttons.borderColor")}</FormLabel>

                  <GradientPicker background={field.value ?? ""} setBackground={field.onChange} />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="theme.buttons.saveContactButton.borderStyle"
              render={({ field }) => (
                <FormItem>
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
        </section>

        <section
          className={cn(
            "flex translate-y-0 flex-col gap-4 rounded-lg border p-6 transition-transform duration-300",
            {
              "h-0 translate-y-10 opacity-0": !enableCustom,
            },
          )}
        >
          <h2 className="text-lg font-semibold">Redes sociales</h2>

          <section className="grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2">
            <FormField
              control={form.control}
              name="theme.buttons.socialLinks.strokeColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color de los íconos</FormLabel>

                  <GradientPicker background={field.value} setBackground={field.onChange} />
                </FormItem>
              )}
            />
          </section>
        </section>

        <section
          className={cn(
            "flex translate-y-0 flex-col gap-4 rounded-lg border p-6 transition-transform duration-300",
            {
              "h-0 translate-y-10 opacity-0": !enableCustom,
            },
          )}
        >
          <h2 className="text-lg font-semibold">Links</h2>

          <section className="grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2">
            <FormField
              control={form.control}
              name="theme.buttons.regularLinks.background"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("themeCustomization.colors.background")}</FormLabel>

                  <GradientPicker background={field.value} setBackground={field.onChange} />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="theme.buttons.regularLinks.textColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("themeCustomization.buttons.textColor")}</FormLabel>

                  <GradientPicker background={field.value} setBackground={field.onChange} />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="theme.buttons.regularLinks.borderColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("themeCustomization.buttons.borderColor")}</FormLabel>

                  <GradientPicker background={field.value ?? ""} setBackground={field.onChange} />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="theme.buttons.regularLinks.borderStyle"
              render={({ field }) => (
                <FormItem>
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
        </section>

        <section
          className={cn(
            "flex translate-y-0 flex-col gap-4 rounded-lg border p-6 transition-transform duration-300",
            {
              "h-0 translate-y-10 opacity-0": !enableCustom,
            },
          )}
        >
          <h2 className="text-lg font-semibold">
            Ambos tipos de botones [Guardar contacto, Links]
          </h2>

          <article className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <FormField
              control={form.control}
              name="theme.buttons.fontWeight"
              render={({ field }) => (
                <FormItem>
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
                <FormItem>
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
