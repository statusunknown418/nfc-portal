"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Cross2Icon, PlusIcon } from "@radix-ui/react-icons";
import { SaveIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { type z } from "zod";
import { Spinner } from "~/components/shared/Spinner";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Switch } from "~/components/ui/switch";
import { useAutoSaveFormData } from "~/lib/hooks/use-auto-save";
import { cn } from "~/lib/utils";
import { editViewerContactSchema } from "~/server/api/schemas.zod";
import { api, type RouterOutputs } from "~/trpc/react";

export const ContactDataForm = ({
  initialData,
  user,
}: {
  initialData: RouterOutputs["vCard"]["get"];
  user: CustomJwtSessionClaims;
}) => {
  const utils = api.useUtils();
  const t = useTranslations("admin.onboarding.steps.contact");

  const { data } = api.vCard.get.useQuery(undefined, { initialData });

  const [isHidden, setIsChecked] = useState(data?.hasContactInfoLocked ?? false);

  const { mutate, isPending } = api.vCard.edit.useMutation({
    onSuccess: async () => {
      toast.success("Information saved!");

      await Promise.all([
        utils.vCard.get.refetch(),
        utils.viewer.previewPortal.invalidate(),
        utils.portals.get.invalidate({ username: user.username }),
      ]);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const { mutateAsync: toggleVisibility } = api.vCard.toggleVisibility.useMutation({
    onSuccess: async () => {
      await Promise.all([
        utils.vCard.get.invalidate(),
        utils.viewer.previewPortal.invalidate(),
        utils.portals.get.invalidate({ username: user.username }),
      ]);
    },
  });

  const handleToggle = () => {
    setIsChecked((prev) => !prev);

    toast.promise(toggleVisibility({ hide: !isHidden }), {
      loading: "Saving...",
      success: `Contact visibility ${isHidden ? "enabled" : "disabled"}`,
      error: "Something went wrong",
    });
  };

  const form = useForm<z.infer<typeof editViewerContactSchema>>({
    resolver: zodResolver(editViewerContactSchema),
    defaultValues: data?.contactJSON
      ? {
          ...data.contactJSON,
          name: {
            first: data.contactJSON.name.first ?? "",
            last: data.contactJSON.name.last ?? "",
          },
          company: {
            name: data.contactJSON.company?.name ?? "",
            department: data.contactJSON.company?.department ?? "",
          },
          jobTitle: data.contactJSON.jobTitle ?? "",
        }
      : {
          name: {
            first: "",
            last: "",
          },
          email: [
            {
              link: user.email ?? "",
              type: "PREF",
            },
          ],
          phoneNumbers: [
            {
              number: "",
              type: "PREF",
            },
          ],
          address: [
            {
              label: "",
              extended: "",
              street: "",
              city: "",
              region: "",
              postalCode: "",
              country: "",
              type: "WORK",
            },
          ],
        },
  });

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

  const {
    fields: addressFields,
    append: appendAddress,
    remove: removeAddress,
  } = useFieldArray({
    name: "address",
    control: form.control,
  });

  const onSubmit = async (data: z.infer<typeof editViewerContactSchema>) => {
    mutate(data);
  };

  useAutoSaveFormData(500, form, (data) => void onSubmit(data), []);

  return (
    <section className="grid grid-cols-1 gap-4 pb-24">
      <div
        className={cn(
          "rounded-lg border border-dashed p-4",
          !isHidden && "border-emerald-600 bg-emerald-50/50",
        )}
      >
        <Label className="flex items-start gap-4">
          <Switch defaultChecked={!isHidden} onCheckedChange={handleToggle} />

          <div className="flex flex-col gap-2">
            <h3>{t("visibilityOptionOne")}</h3>
            <p className="text-muted-foreground">{t("visibilityOptionTwo")}</p>
          </div>
        </Label>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid h-max grid-cols-1 gap-6 rounded-lg border bg-white/30 p-6"
        >
          <Alert variant="indigo">
            <SaveIcon size={16} />

            <AlertTitle>{t("autosave")}</AlertTitle>
            <AlertDescription>
              <p>{t("autosaveDescription")}</p>

              {isPending && (
                <Badge variant="outline" className="absolute right-4 top-2 h-7 animate-pulse">
                  <Spinner className="mr-2" />
                  Saving ...
                </Badge>
              )}
            </AlertDescription>
          </Alert>

          <article className="flex w-full flex-col gap-4">
            <div className="flex gap-2">
              <FormField
                control={form.control}
                name="name.first"
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormLabel>{t("firstName")}</FormLabel>

                    <FormControl>
                      <Input autoComplete="given-name" {...field} />
                    </FormControl>
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
                  </FormItem>
                )}
              />
            </div>

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
            </div>
          </article>

          <section className="grid w-full grid-cols-1 gap-3">
            <Label asChild>
              <p>{t("emails.label")}</p>
            </Label>

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
          </section>

          <section className="grid grid-cols-1 gap-3">
            <Label asChild>
              <p>{t("phoneNumbers.label")}</p>
            </Label>

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
          </section>

          <section className="grid w-full grid-cols-1 gap-3">
            <Label asChild>
              <p>{t("addresses.label")}</p>
            </Label>

            {addressFields.map((address, idx) => (
              <article className="flex w-full flex-col gap-2" key={address.id}>
                <div className="flex flex-col gap-2 md:flex-row">
                  <FormField
                    control={form.control}
                    name={`address.${idx}.type`}
                    render={({ field }) => (
                      <FormItem>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="h-[36px] min-w-32">
                            <SelectValue placeholder="Home" />
                          </SelectTrigger>

                          <SelectContent>
                            <SelectItem value="DOM">{t("addresses.types.DOM")}</SelectItem>
                            <SelectItem value="HOME">{t("addresses.types.HOME")}</SelectItem>
                            <SelectItem value="WORK">{t("addresses.types.WORK")}</SelectItem>
                            <SelectItem value="POSTAL">{t("addresses.types.POSTAL")}</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name={`address.${idx}.street`}
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="flex-grow md:self-end">
                        <Input
                          placeholder="Street address"
                          autoComplete="address-line1"
                          {...field}
                        />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex w-full flex-col gap-2 md:flex-row md:gap-0">
                  <FormField
                    control={form.control}
                    name={`address.${idx}.region`}
                    render={({ field }) => (
                      <FormItem className="flex-grow">
                        <Input
                          placeholder="State"
                          className="flex-grow rounded-r-none border-r-0"
                          {...field}
                        />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`address.${idx}.city`}
                    render={({ field }) => (
                      <FormItem className="flex-grow">
                        <Input
                          placeholder="City"
                          className="flex-grow rounded-none border-r-0"
                          {...field}
                        />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`address.${idx}.postalCode`}
                    render={({ field }) => (
                      <FormItem className="flex-grow">
                        <Input
                          placeholder="Zip code"
                          autoComplete="postal-code"
                          className="rounded-none border-r-0"
                          {...field}
                        />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`address.${idx}.country`}
                    render={({ field }) => (
                      <FormItem className="flex-grow">
                        <Input
                          placeholder="Country"
                          autoComplete="country-name"
                          className="rounded-l-none"
                          {...field}
                        />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="mt-1 flex justify-end">
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-r-none"
                    type="button"
                    disabled={addressFields.length >= 2}
                    onClick={() =>
                      appendAddress({
                        label: "",
                        extended: "",
                        street: "",
                        city: "",
                        region: "",
                        postalCode: "",
                        country: "",
                      })
                    }
                  >
                    <PlusIcon /> {t("addLabel")}
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive_ghost"
                    className="rounded-l-none"
                    type="button"
                    disabled={idx === 0}
                    onClick={() => idx !== 0 && removeAddress(idx)}
                  >
                    <Cross2Icon /> {t("removeLabel")}
                  </Button>
                </div>
              </article>
            ))}
          </section>
        </form>
      </Form>
    </section>
  );
};
