"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Cross2Icon, PlusIcon } from "@radix-ui/react-icons";
import { SaveIcon } from "lucide-react";
import { type User } from "next-auth";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { type z } from "zod";
import { Spinner } from "~/components/shared/Spinner";
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
import { cardPreviewsStore } from "~/lib/stores/cardPreviews";
import { cn } from "~/lib/utils";
import { editViewerContactSchema } from "~/server/api/schemas.zod";
import { api, type RouterOutputs } from "~/trpc/react";

export const ContactDataForm = ({
  initialData,
  user,
}: {
  initialData: RouterOutputs["vCard"]["get"];
  user: User & { username?: string };
}) => {
  const utils = api.useUtils();

  const { data } = api.vCard.get.useQuery(undefined, { initialData });
  const [isHidden, setIsChecked] = useState(data?.hasContactInfoLocked ?? false);

  const { mutateAsync } = api.vCard.edit.useMutation({
    onSuccess: async () => {
      await Promise.all([
        utils.vCard.get.invalidate(),
        utils.portals.get.invalidate({ username: user.username }),
      ]);
    },
  });

  const { mutateAsync: toggleVisibility } = api.vCard.toggleVisibility.useMutation({
    onSuccess: async () => {
      await Promise.all([
        utils.vCard.get.invalidate(),
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
      ? data?.contactJSON
      : {
          name: {
            first: user.name?.split(" ")[0] ?? "",
            last: user.name?.split(" ")[1] ?? "",
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

  const setContactPreview = cardPreviewsStore((s) => s.setPreview);

  const handleSubmit = form.handleSubmit(async (data) => {
    toast.promise(mutateAsync(data), {
      loading: "Saving...",
      success: "Contact information saved",
      error: "Something went wrong",
    });
  });

  useEffect(() => {
    if (!data?.contactJSON) {
      return;
    }

    setContactPreview(data?.contactJSON);
  }, [data?.contactJSON, setContactPreview]);

  return (
    <section className="grid grid-cols-1 gap-4">
      <p className="text-sm text-muted-foreground">
        Manage your contact information here, this is what every person you give your card to will
        see, additionally it is possible to hide it from your public page if needed.
      </p>

      <div
        className={cn(
          "rounded-lg border border-dashed p-4",
          !isHidden && "border-emerald-600 bg-emerald-50/50",
        )}
      >
        <Label className="flex items-center gap-4">
          <Switch defaultChecked={!isHidden} onCheckedChange={handleToggle} />
          Enable contact information visibility
        </Label>
      </div>

      <Form {...form}>
        <form
          onSubmit={handleSubmit}
          className="grid h-max grid-cols-1 gap-6 rounded-lg border bg-white/30 p-6"
        >
          <article className="flex w-full flex-col gap-4">
            <div className="flex gap-2">
              <FormField
                control={form.control}
                name="name.first"
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormLabel>First name</FormLabel>

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
                    <FormLabel>Last name</FormLabel>

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
                    <FormLabel>Position</FormLabel>

                    <FormControl>
                      <Input
                        placeholder="CEO & co-founder"
                        autoComplete="organization-title"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="company.name"
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormLabel>Company</FormLabel>

                    <FormControl>
                      <Input placeholder="Stackk Studios" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormLabel>Company website</FormLabel>

                    <FormControl>
                      <Input placeholder="stackkstudios.com" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </article>

          <section className="grid w-full grid-cols-1 gap-2">
            <Label asChild>
              <p>Email addresses (max. 3)</p>
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
                          <SelectItem value="PREF">Primary</SelectItem>
                          <SelectItem value="WORK">Work</SelectItem>
                          <SelectItem value="HOME">Home</SelectItem>
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
                    className="rounded-r-none"
                    disabled={emailFields.length >= 3}
                    onClick={() =>
                      emailFields.length < 3 && appendEmail({ link: "", type: "WORK" })
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

          <section className="grid grid-cols-1 gap-2">
            <Label asChild>
              <p>Phone numbers (max. 5)</p>
            </Label>

            {phoneFields.map((phone, idx) => (
              <div className="flex w-full gap-2" key={phone.id}>
                <FormField
                  control={form.control}
                  name={`phoneNumbers.${idx}.number`}
                  render={({ field }) => (
                    <FormItem className="flex-grow">
                      <FormControl>
                        <Input placeholder="555 123 4567" {...field} />
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
                          <SelectItem value="PREF">Preferred</SelectItem>
                          <SelectItem value="WORK">Work</SelectItem>
                          <SelectItem value="HOME">Home</SelectItem>
                          <SelectItem value="FAX">Fax</SelectItem>
                          <SelectItem value="MSG">Messages</SelectItem>
                          <SelectItem value="CELL">Cellular</SelectItem>
                          <SelectItem value="BBS">Bulletin Board</SelectItem>
                          <SelectItem value="VIDEO">Video</SelectItem>
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
                    className="rounded-r-none"
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

          <section className="grid w-full grid-cols-1 gap-2">
            <Label asChild>
              <p>Addresses</p>
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
                            <SelectItem value="DOM">Primary</SelectItem>
                            <SelectItem value="HOME">Home</SelectItem>
                            <SelectItem value="WORK">Work</SelectItem>
                            <SelectItem value="POSTAL">Postal</SelectItem>
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
                    <PlusIcon /> Add another
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive_ghost"
                    className="rounded-l-none"
                    type="button"
                    disabled={idx === 0}
                    onClick={() => idx !== 0 && removeAddress(idx)}
                  >
                    <Cross2Icon /> Remove
                  </Button>
                </div>
              </article>
            ))}
          </section>

          <Button className="mt-4" variant="primary">
            {form.formState.isSubmitting ? <Spinner /> : <SaveIcon size={15} />}
            Save
          </Button>
        </form>
      </Form>
    </section>
  );
};
