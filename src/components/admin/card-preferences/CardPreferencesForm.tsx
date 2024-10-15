"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  RadioGroupItem as RadioGroupItemRadix,
  RadioGroup as RadioGroupRadix,
} from "@radix-ui/react-radio-group";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import useFormPersist from "react-hook-form-persist";
import { toast } from "sonner";
import { useAutoSaveFormData } from "~/lib/hooks/use-auto-save";
import { nfcPreferencesStore } from "~/lib/stores/nfcPreferences";
import { basicCardTemplates, cn } from "~/lib/utils";
import { type SaveNFCPreferences, saveNFCPreferencesSchema } from "~/server/api/schemas.zod";
import { Form, FormField, FormItem } from "../../ui/form";
import { Label } from "../../ui/label";
import { CardTemplateModal } from "./CardTemplateModal";
import { CustomCardDesignsSelector } from "./CustomCardDesignsSelector";
import { OptionsSelector } from "./OptionsSelector";

export const CardPreferencesForm = () => {
  const setPreferences = nfcPreferencesStore((s) => s.setPreferences);
  const t = useTranslations("admin.onboarding.steps.cardPreferences");

  const form = useForm<SaveNFCPreferences>({
    resolver: zodResolver(saveNFCPreferencesSchema),
  });

  const cardVariant = form.watch("cardVariant");
  const selectedTemplate = form.watch("cardTemplate");

  const handleSubmit = async (data: SaveNFCPreferences) => {
    toast.promise(new Promise((resolve) => resolve(setPreferences(data))), {
      loading: "Saving...",
      success: "Saved!",
      error: (err) => `Failed to save: ${err}`,
    });
  };

  useAutoSaveFormData(200, form, (data) => void handleSubmit(data), []);

  useFormPersist("auto-save:nfc-preferences", {
    ...form,
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex w-full flex-col gap-4">
        <h3 className="text-lg font-medium">1. {t("variant.label")}</h3>

        <FormField
          name="cardVariant"
          control={form.control}
          render={({ field }) => (
            <RadioGroupRadix value={field.value} onValueChange={field.onChange}>
              <div className="flex gap-4">
                <DefaultCard />
                <CustomCard />
                <MetallicCard />
              </div>
            </RadioGroupRadix>
          )}
        />

        <FormField
          control={form.control}
          name="cardTemplate"
          render={({ field }) => (
            <FormItem
              className={cn(
                "mt-4 h-auto opacity-100 transition-all",
                cardVariant !== "basic" && "pointer-events-none hidden h-0 opacity-0",
              )}
            >
              <Label className="text-lg">2. {t("templates.title")}</Label>

              <RadioGroupRadix value={field.value} onValueChange={field.onChange}>
                <div className="relative flex min-h-40 min-w-full flex-wrap gap-4">
                  {basicCardTemplates.map((template) => (
                    <CardTemplateModal
                      key={template.value}
                      value={template.value}
                      front={template.front}
                      back={template.back}
                      className={cn(
                        selectedTemplate === template.value &&
                          "z-10 opacity-100 ring ring-ring ring-offset-1",
                        "transition-all",
                      )}
                    />
                  ))}
                </div>
              </RadioGroupRadix>
            </FormItem>
          )}
        />

        <OptionsSelector />

        <CustomCardDesignsSelector />
      </form>
    </Form>
  );
};

const DefaultCard = () => {
  const t = useTranslations("admin.onboarding.steps.cardPreferences");

  return (
    <RadioGroupItemRadix
      className="h-28 w-52 rounded-lg border bg-background p-4 text-black shadow transition-all data-[state=checked]:ring data-[state=checked]:ring-ring data-[state=checked]:ring-offset-1"
      value="basic"
    >
      <h4>{t("variant.basic")}</h4>
    </RadioGroupItemRadix>
  );
};

const CustomCard = () => {
  const t = useTranslations("admin.onboarding.steps.cardPreferences");
  return (
    <RadioGroupItemRadix
      className="h-28 w-52 rounded-lg border bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4 shadow-md transition-all data-[state=checked]:ring data-[state=checked]:ring-ring data-[state=checked]:ring-offset-1"
      value="custom"
    >
      <h4 className="bg-clip-text font-medium text-white">{t("variant.custom")}</h4>
    </RadioGroupItemRadix>
  );
};

const MetallicCard = () => {
  const t = useTranslations("admin.onboarding.steps.cardPreferences");
  const common = useTranslations("common");

  return (
    <div className="cursor-not-allowed opacity-50">
      <section className="flex h-28 w-52 flex-col items-center justify-center rounded-lg border border-dashed bg-gradient-to-r from-zinc-400 via-transparent to-zinc-400 p-4 shadow-lg transition-all data-[state=checked]:ring data-[state=checked]:ring-ring data-[state=checked]:ring-offset-1">
        <h4 className="font-bold text-primary">{t("variant.metallic")}</h4>
        <p className="mt-1 text-center text-sm">{common("comingSoon")}</p>
      </section>
    </div>
  );
};
