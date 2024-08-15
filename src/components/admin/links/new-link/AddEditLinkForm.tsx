"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LightningBoltIcon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { getAvailableLinkPosition, setAvailableLinkPosition } from "~/lib/cookies.actions";
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
import { Switch } from "~/components/ui/switch";
import { positionsStore } from "~/lib/stores/positions";
import { cn } from "~/lib/utils";
import { newLinkSchema, type NewLinkSchema } from "~/server/db/schema";
import { api } from "~/trpc/react";

export function AddEditLinkForm({
  className,
  onClose,
  defaultValues,
  username,
}: {
  className?: string;
  onClose?: () => void;
  defaultValues?: NewLinkSchema;
  username: string;
}) {
  const isEditing = !!defaultValues;

  const optimisticItemPosition = positionsStore((s) => s.getPosition);

  const form = useForm<NewLinkSchema>({
    resolver: zodResolver(newLinkSchema),
    defaultValues: isEditing
      ? defaultValues
      : {
          type: "basic",
          displayText: "",
          url: "",
          position: Math.random() * 1000,
        },
  });

  const utils = api.useUtils();

  const editLink = api.links.edit.useMutation({
    onSuccess: async () => {
      form.reset();
      onClose?.();
      await Promise.all([utils.links.all.invalidate(), utils.portals.get.invalidate({ username })]);
    },
  });

  const newLink = api.links.new.useMutation({
    onMutate: async (vars) => {
      void utils.links.all.cancel();
      const prevData = utils.links.all.getData();

      const tempId = Math.random() * 1000;

      utils.links.all.setData(
        undefined,
        prevData?.concat([
          {
            id: tempId,
            displayText: vars.displayText ?? "Untitled link",
            url: vars.url ?? "",
            thumbnail: "",
            isActive: true,
            type: vars.type ?? "basic",
            layout: vars.layout ?? "basic",
            position: vars.position ?? 0,
            createdAt: new Date(),
            updatedAt: new Date(),
            userId: vars.userId ?? "",
          },
        ]),
      );

      onClose?.();
      return prevData;
    },
    onSuccess: async (data) => {
      toast.success("Link created!");
      form.reset();

      await Promise.all([utils.links.all.invalidate(), utils.portals.get.invalidate({ username })]);

      await setAvailableLinkPosition(data?.position ?? 0);
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    if (!isEditing) {
      const newPosition = await getAvailableLinkPosition();

      newLink.mutate({
        ...data,
        displayText: !data.displayText?.length ? "Untitled link" : data.displayText.trim(),
        position: parseInt(newPosition.data),
      });

      return;
    }

    if (!data.id) {
      return;
    }

    toast.promise(
      editLink.mutateAsync({
        ...data,
        displayText: !data.displayText?.length ? "Untitled link" : data.displayText.trim(),
        position: optimisticItemPosition(data.id),
      }),
      {
        loading: "Saving...",
        success: "Link updated!",
        error: "Failed to update link",
      },
    );
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className={cn("grid items-start gap-4", className)}>
        {isEditing && (
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between gap-4 space-y-0 rounded-lg border border-dashed bg-muted/50 px-4 py-3">
                <FormLabel className="flex items-center gap-1">
                  Active! {<LightningBoltIcon className="text-amber-600" />}
                </FormLabel>

                <FormControl>
                  <Switch checked={field.value ?? false} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        )}

        <FormField
          name="url"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL</FormLabel>

              <FormControl>
                <Input
                  placeholder="https://example.com"
                  {...field}
                  value={field.value ?? ""}
                  className="h-12 rounded-full px-6 text-base"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="displayText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>

              <FormControl>
                <Input placeholder="My website" {...field} value={field.value ?? ""} />
              </FormControl>
            </FormItem>
          )}
        />

        <Button size="lg" className="mt-4 w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting && <Spinner className="text-primary-foreground" />}
          {isEditing ? "Save" : "Add it!"}
        </Button>
      </form>
    </Form>
  );
}
