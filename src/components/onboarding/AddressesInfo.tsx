"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Spinner } from "@phosphor-icons/react";
import { FloppyDisk } from "@phosphor-icons/react/dist/ssr";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type z } from "zod";
import { useAutoSaveFormData } from "~/lib/hooks/use-auto-save";
import { editViewerContactSchema } from "~/server/api/schemas.zod";
import { api, type RouterOutputs } from "~/trpc/react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Badge } from "../ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";

export const AddressesInfo = ({ initialData }: { initialData: RouterOutputs["vCard"]["get"] }) => {
  const { data } = api.vCard.get.useQuery(undefined, { initialData });

  const form = useForm<z.infer<typeof editViewerContactSchema>>({
    resolver: zodResolver(editViewerContactSchema),
    defaultValues: data?.contactJSON
      ? {
          ...data.contactJSON,
          profileHeader: data.profileHeader ?? "",
          phoneNumbers: !!data.contactJSON.phoneNumbers?.length
            ? data.contactJSON.phoneNumbers
            : [
                {
                  number: "",
                  type: "PREF",
                },
              ],
        }
      : {
          profileHeader: "",
          phoneNumbers: [
            {
              number: "",
              type: "PREF",
            },
          ],
        },
  });

  const t = useTranslations("admin.onboarding.steps.contact");

  const utils = api.useUtils();
  const { mutate, isPending } = api.vCard.edit.useMutation({
    onSuccess: async () => {
      toast.success("Information saved!");

      await Promise.all([utils.vCard.get.refetch(), utils.viewer.previewPortal.invalidate()]);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const onSubmit = async (data: z.infer<typeof editViewerContactSchema>) => {
    mutate(data);
  };

  useAutoSaveFormData(500, form, (data) => void onSubmit(data), []);

  return (
    <>
      <article className="w-full">
        <h3 className="text-2xl font-semibold tracking-wide">A qué te dedicas?</h3>
        <p className="mt-1 text-muted-foreground">
          Puedes añadir un cargo, nombre de tu empresa y área en la que trabajas.
        </p>
      </article>

      <Form {...form}>
        <form
          className="relative flex w-full flex-col gap-4 rounded-t-xl border p-6"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <Alert variant="indigo" className="relative">
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

          <FormField
            control={form.control}
            name="profileHeader"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Describe yourself</FormLabel>

                <FormControl>
                  <Input
                    placeholder="Software Engineer"
                    autoComplete="organization-title"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex gap-2">
            <FormField
              name="jobTitle"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("position")}</FormLabel>

                  <FormControl>
                    <Input placeholder="CEO" autoComplete="organization-title" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="company.name"
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormLabel>{t("company")}</FormLabel>

                  <FormControl>
                    <Input placeholder="ACME Corp." {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="company.department"
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormLabel>Departamento</FormLabel>

                  <FormControl>
                    <Input placeholder="Engineering" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem className="flex-grow">
                <FormLabel>{t("companyWebsite")}</FormLabel>

                <FormControl>
                  <Input placeholder="acme.com" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </>
  );
};
