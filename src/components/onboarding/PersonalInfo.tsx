"use client";

import { useQueryStates } from "nuqs";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type z } from "zod";
import { useAutoSaveFormData } from "~/lib/hooks/use-auto-save";
import { editViewerContactSchema } from "~/server/api/schemas.zod";
import { api, type RouterOutputs } from "~/trpc/react";
import { Button } from "../ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { contactStepParsers } from "./contactStep.parsers";
import { FloppyDisk, Spinner } from "@phosphor-icons/react";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import { Badge } from "../ui/badge";
import { useRouter } from "next/navigation";

export const PersonalInfoForm = ({
  initialData,
}: {
  initialData: RouterOutputs["vCard"]["get"];
}) => {
  const utils = api.useUtils();
  const [_, update] = useQueryStates(contactStepParsers, { history: "push" });
  const router = useRouter();

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

  const onSubmit = async (data: z.infer<typeof editViewerContactSchema>) => {
    mutate(data);
  };

  useAutoSaveFormData(500, form, (data) => void onSubmit(data), []);

  return (
    <>
      <article className="w-full">
        <h3 className="text-2xl font-semibold tracking-wide">Contact information</h3>
        <p className="mt-1 text-muted-foreground">
          First step is just tell us a little bit about yourself.
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

          <div className="mt-2 flex gap-2">
            <FormField
              control={form.control}
              name="name.first"
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormLabel>{t("firstName")}</FormLabel>

                  <FormControl>
                    <Input autoComplete="given-name" {...field} />
                  </FormControl>

                  <FormDescription>You can decide to add a middle name or not.</FormDescription>
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

                  <FormDescription>Also it is not mandatory to add a last name.</FormDescription>
                </FormItem>
              )}
            />
          </div>

          <article className="mt-2 flex w-full flex-col justify-center gap-4 sm:flex-row">
            <Button
              type="button"
              className="aspect-square w-auto self-center rounded-full"
              variant="secondary_ghost"
              onClick={() => {
                void update({ step: "work" });
                router.refresh();
              }}
            >
              How to contact you
              <ArrowRightIcon className="h-5 w-5" />
            </Button>
          </article>
        </form>
      </Form>
    </>
  );
};
