"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { DiscIcon, PlusCircledIcon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Form, FormItem } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select, SelectTrigger, SelectValue } from "~/components/ui/select";
import { editViewerContactSchema } from "~/server/api/schemas.zod";
import { api, type RouterOutputs } from "~/trpc/react";

export const ContactDataForm = ({
  initialData,
}: {
  initialData: RouterOutputs["vCard"]["get"];
}) => {
  const { data } = api.vCard.get.useQuery(undefined, { initialData });
  const form = useForm({
    resolver: zodResolver(editViewerContactSchema),
    defaultValues: data?.contactJSON ? data?.contactJSON : {},
  });

  return (
    <Form {...form}>
      <form className="mt-4 grid h-max grid-cols-1 gap-4 rounded-lg border bg-white/30 p-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-4 md:gap-10 lg:flex-row">
            <Avatar className="h-32 w-32 max-w-32">
              <AvatarFallback />
              <AvatarImage src="https://picsum.photos/id/1005/200/200" />
            </Avatar>
          </div>

          <article className="flex w-full flex-col gap-4">
            <div className="flex gap-2">
              <FormItem className="">
                <Label>Company</Label>
                <Input placeholder="Meow Studios" />
              </FormItem>

              <FormItem>
                <Label>Position</Label>
                <Input placeholder="CEO" />
              </FormItem>
            </div>

            <div className="flex gap-2">
              <FormItem className="flex-grow">
                <Label>Name</Label>
                <Input placeholder="Alvaro" />
              </FormItem>

              <FormItem className="flex-grow">
                <Label>Last name</Label>
                <Input placeholder="Aquije" />
              </FormItem>
            </div>
          </article>
        </div>

        <div className="flex gap-2">
          <FormItem className="flex-grow">
            <Label>Email</Label>
            <Input placeholder="alvaro@example.com" autoComplete="email" />
          </FormItem>

          <FormItem className="self-end">
            <Select>
              <SelectTrigger className="h-[36px] min-w-32">
                <SelectValue placeholder="Primary" />
              </SelectTrigger>
            </Select>
          </FormItem>

          <Button variant="ghost" size="icon" type="button" className="mb-0.5 self-end">
            <PlusCircledIcon />
          </Button>
        </div>

        <div className="flex gap-2">
          <FormItem className="flex-grow">
            <Label>Phone number</Label>
            <Input placeholder="+51 993606898" />
          </FormItem>

          <FormItem className="self-end">
            <Select>
              <SelectTrigger className="h-[36px] min-w-32">
                <SelectValue placeholder="Telephone" />
              </SelectTrigger>
            </Select>
          </FormItem>

          <Button variant="ghost" size="icon" type="button" className="mb-0.5 self-end">
            <PlusCircledIcon />
          </Button>
        </div>

        <div className="flex flex-col gap-2 md:flex-row">
          <FormItem>
            <Label>Address type</Label>
            <Select>
              <SelectTrigger className="h-[36px] min-w-32">
                <SelectValue placeholder="Home" />
              </SelectTrigger>
            </Select>
          </FormItem>

          <FormItem className="flex-grow md:self-end">
            <Input placeholder="Street address" />
          </FormItem>
        </div>

        <div className="flex flex-col gap-2 md:flex-row">
          <FormItem>
            <Input placeholder="City" autoComplete="address-level1" />
          </FormItem>

          <FormItem>
            <Input placeholder="State" />
          </FormItem>

          <FormItem>
            <Input placeholder="Zip code" autoComplete="postal-code" />
          </FormItem>

          <FormItem>
            <Input placeholder="Country" autoComplete="country" />
          </FormItem>
        </div>

        <Button className="mt-4" variant="primary">
          <DiscIcon />
          Save
        </Button>
      </form>
    </Form>
  );
};
