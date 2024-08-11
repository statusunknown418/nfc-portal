"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
import { cn } from "~/lib/utils";
import { newLinkSchema, type NewLinkSchema } from "~/server/db/schema";
import { api } from "~/trpc/react";

export function NewLinkForm({ className, onClose }: { className?: string; onClose?: () => void }) {
  const form = useForm<NewLinkSchema>({
    resolver: zodResolver(newLinkSchema),
    defaultValues: {
      type: "basic",
      displayText: "",
      url: "",
      position: 0,
    },
  });

  const utils = api.useUtils();

  const { mutate } = api.links.new.useMutation({
    onMutate: async (vars) => {
      void utils.links.all.cancel();
      const prevData = utils.links.all.getData();

      const tempId = Math.random() * 1000;

      utils.links.all.setData(
        undefined,
        prevData?.concat([
          {
            id: tempId,
            displayText: vars.displayText ?? "",
            url: vars.url ?? "",
            thumbnail: "",
            isActive: true,
            type: vars.type ?? "basic",
            layout: vars.layout ?? "basic",
            position: tempId,
            createdAt: new Date(),
            updatedAt: new Date(),
            userId: vars.userId ?? "",
          },
        ]),
      );

      onClose?.();
      return prevData;
    },
    onSuccess: () => {
      toast.success("Link created!");
      form.reset();
      void utils.links.all.invalidate();
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    const lastPosition = utils.links.all.getData()?.length ?? 0;

    mutate({
      ...data,
      position: lastPosition,
    });
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className={cn("grid items-start gap-4", className)}>
        <FormField
          control={form.control}
          name="displayText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>

              <FormControl>
                <Input placeholder="My website" {...field} value={field.value ?? ""} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          name="url"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Links to</FormLabel>

              <FormControl>
                <Input placeholder="https://example.com" {...field} value={field.value ?? ""} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button size="lg" className="mt-4">
          Add it!
        </Button>
      </form>
    </Form>
  );
}
