"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Cross2Icon, DiscIcon, PlusIcon } from "@radix-ui/react-icons";
import { type User } from "next-auth";
import { useFieldArray, useForm } from "react-hook-form";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
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
import { editViewerContactSchema } from "~/server/api/schemas.zod";
import { api, type RouterOutputs } from "~/trpc/react";

export const ContactDataForm = ({
  initialData,
  user,
}: {
  initialData: RouterOutputs["vCard"]["get"];
  user: User;
}) => {
  const { data } = api.vCard.get.useQuery(undefined, { initialData });
  const form = useForm({
    resolver: zodResolver(editViewerContactSchema),
    defaultValues: data?.contactJSON
      ? data?.contactJSON
      : {
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

  const handleSubmit = form.handleSubmit(async (data) => {
    console.log(data);
  });

  return (
    <Form {...form}>
      <form className="grid h-max grid-cols-1 gap-6 rounded-lg border bg-white/30 p-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-4 md:gap-10 lg:flex-row">
            <Avatar className="h-32 w-32 max-w-32">
              <AvatarFallback />
              {!!user.image && <AvatarImage src={user.image} />}
            </Avatar>
          </div>

          <article className="flex w-full flex-col gap-4">
            <div className="flex gap-2">
              <FormField
                name="jobTitle"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position</FormLabel>

                    <FormControl>
                      <Input placeholder="CEO & co-founder" {...field} />
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

            <div className="flex gap-2">
              <FormField
                control={form.control}
                name="name.first"
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormLabel>First name</FormLabel>

                    <FormControl>
                      <Input placeholder="Someone" {...field} />
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
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </article>
        </div>

        <section className="grid w-full grid-cols-1 gap-2">
          <Label asChild>
            <p>Email addresses (max. 3)</p>
          </Label>

          {emailFields.map((email, idx) => (
            <div className="flex w-full gap-2" key={email.id}>
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

              <div className="mt-0.5 flex gap-0">
                <Button
                  variant="outline"
                  size="icon"
                  type="button"
                  className="rounded-r-none"
                  disabled={emailFields.length >= 3}
                  onClick={() => emailFields.length < 3 && appendEmail({ link: "", type: "WORK" })}
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
                      <Select>
                        <SelectTrigger className="h-[36px] min-w-32">
                          <SelectValue placeholder="Home" />
                        </SelectTrigger>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormItem className="flex-grow md:self-end">
                  <Input placeholder="Street address" />
                </FormItem>
              </div>

              <div className="flex w-full flex-col gap-2 md:flex-row md:gap-0">
                <FormItem className="flex-grow">
                  <Input
                    placeholder="City"
                    autoComplete="address-level1"
                    className="flex-grow rounded-r-none border-r-0"
                  />
                </FormItem>

                <FormItem className="flex-grow">
                  <Input placeholder="State" className="flex-grow rounded-none border-r-0" />
                </FormItem>

                <FormItem className="flex-grow">
                  <Input
                    placeholder="Zip code"
                    autoComplete="postal-code"
                    className="rounded-none border-r-0"
                  />
                </FormItem>

                <FormItem className="flex-grow">
                  <Input placeholder="Country" autoComplete="country" className="rounded-l-none" />
                </FormItem>
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
          <DiscIcon />
          Save
        </Button>
      </form>
    </Form>
  );
};
