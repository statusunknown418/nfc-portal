"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Spinner } from "@phosphor-icons/react";
import { FloppyDisk } from "@phosphor-icons/react/dist/ssr";
import { Cross2Icon, PlusIcon } from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { type z } from "zod";
import { useAutoSaveFormData } from "~/lib/hooks/use-auto-save";
import { editViewerContactSchema } from "~/server/api/schemas.zod";
import { api, type RouterOutputs } from "~/trpc/react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export const HowToContact = ({
  initialData,
  user,
}: {
  initialData: RouterOutputs["vCard"]["get"];
  user: CustomJwtSessionClaims;
}) => {
  const { data } = api.vCard.get.useQuery(undefined, { initialData });

  const form = useForm<z.infer<typeof editViewerContactSchema>>({
    resolver: zodResolver(editViewerContactSchema),
    defaultValues: data?.contactJSON
      ? {
          ...data.contactJSON,
          phoneNumbers: !!data.contactJSON.phoneNumbers?.length
            ? data.contactJSON.phoneNumbers
            : [
                {
                  number: "",
                  type: "PREF",
                },
              ],
          email: !!data.contactJSON.email?.length
            ? data.contactJSON.email
            : [
                {
                  link: "",
                  type: "PREF",
                },
              ],
        }
      : {
          phoneNumbers: [
            {
              number: "",
              type: "PREF",
            },
          ],
          email: [
            {
              link: user.email ?? "",
              type: "PREF",
            },
          ],
        },
  });

  const t = useTranslations("admin.onboarding.steps.contact");
  const common = useTranslations("common");

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
    const validEmails = data.email?.filter((email) => !!email.link);

    mutate({
      ...data,
      email: validEmails,
    });
  };

  const {
    fields: phoneFields,
    append: appendPhone,
    remove: removePhone,
  } = useFieldArray({
    name: "phoneNumbers",
    control: form.control,
  });

  const {
    fields: emailFields,
    append: appendEmail,
    remove: removeEmail,
  } = useFieldArray({
    name: "email",
    control: form.control,
  });

  useAutoSaveFormData(500, form, (data) => void onSubmit(data), []);

  return (
    <>
      <article className="w-full">
        <h3 className="text-2xl font-semibold tracking-wide">{t("howToContactTitle")}</h3>
        <p className="mt-1 text-muted-foreground">{t("howToContactDescription")}</p>
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
                  {common("saving")}...
                </Badge>
              )}
            </AlertDescription>
          </Alert>

          <FormItem>
            <Label>{t("phoneNumbers.label")}</Label>

            {phoneFields.map((phone, idx) => (
              <div className="flex w-full gap-2" key={phone.id}>
                <FormField
                  control={form.control}
                  name={`phoneNumbers.${idx}.number`}
                  render={({ field }) => (
                    <FormItem className="flex-grow">
                      <FormControl>
                        <Input placeholder="123 456 789" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`phoneNumbers.${idx}.type`}
                  render={({ field }) => (
                    <FormItem className="self-end">
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="h-[36px] min-w-32">
                          <SelectValue placeholder="Primary" />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem value="PREF">{t("phoneNumbers.types.PREF")}</SelectItem>
                          <SelectItem value="WORK">{t("phoneNumbers.types.WORK")}</SelectItem>
                          <SelectItem value="HOME">{t("phoneNumbers.types.HOME")}</SelectItem>
                          <SelectItem value="FAX">{t("phoneNumbers.types.FAX")}</SelectItem>
                          <SelectItem value="MSG">{t("phoneNumbers.types.MSG")}</SelectItem>
                          <SelectItem value="CELL">{t("phoneNumbers.types.CELL")}</SelectItem>
                          <SelectItem value="BBS">{t("phoneNumbers.types.BBS")}</SelectItem>
                          <SelectItem value="VIDEO">{t("phoneNumbers.types.VIDEO")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <div className="mt-0.5 flex gap-0">
                  <Button
                    variant="outline"
                    size="icon"
                    type="button"
                    className="rounded-r-none shadow-none"
                    disabled={phoneFields.length >= 5}
                    onClick={() =>
                      phoneFields.length < 5 && appendPhone({ number: "", type: "WORK" })
                    }
                  >
                    <PlusIcon />
                  </Button>

                  <Button
                    variant="destructive_ghost"
                    size="icon"
                    className="rounded-l-none"
                    type="button"
                    disabled={idx === 0}
                    onClick={() => idx !== 0 && removePhone(idx)}
                  >
                    <Cross2Icon />
                  </Button>
                </div>
              </div>
            ))}
          </FormItem>

          <FormItem>
            <Label>{t("emails.label")}</Label>
            {emailFields.map((email, idx) => (
              <div className="flex w-full gap-2" key={email.id}>
                <FormField
                  control={form.control}
                  name={`email.${idx}.type`}
                  render={({ field }) => (
                    <FormItem className="self-end">
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="h-[36px] min-w-32">
                          <SelectValue placeholder="Primary" />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem value="PREF">{t("emails.types.PREF")}</SelectItem>
                          <SelectItem value="WORK">{t("emails.types.WORK")}</SelectItem>
                          <SelectItem value="HOME">{t("emails.types.HOME")}</SelectItem>
                          <SelectItem value="OTHER">{t("emails.types.OTHER")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`email.${idx}.link`}
                  render={({ field }) => (
                    <FormItem className="flex-grow">
                      <FormControl>
                        <Input placeholder="alvaro@example.com" autoComplete="email" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="mt-0.5 flex gap-0">
                  <Button
                    variant="outline"
                    size="icon"
                    type="button"
                    className="rounded-r-none shadow-none"
                    disabled={emailFields.length >= 5}
                    onClick={() =>
                      emailFields.length < 5 && appendEmail({ link: "", type: "WORK" })
                    }
                  >
                    <PlusIcon />
                  </Button>

                  <Button
                    variant="destructive_ghost"
                    size="icon"
                    type="button"
                    className="rounded-l-none"
                    disabled={idx === 0}
                    onClick={() => idx !== 0 && removeEmail(idx)}
                  >
                    <Cross2Icon />
                  </Button>
                </div>
              </div>
            ))}
          </FormItem>
        </form>
      </Form>
    </>
  );
};
