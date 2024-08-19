"use client";

import { useAutoAnimate } from "@formkit/auto-animate/react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircledIcon,
  CrossCircledIcon,
  ExternalLinkIcon,
  FileTextIcon,
  LightningBoltIcon,
} from "@radix-ui/react-icons";
import { RadioGroupItem } from "@radix-ui/react-radio-group";
import { type TRPCError } from "@trpc/server";
import Image from "next/image";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Spinner } from "~/components/shared/Spinner";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { RadioGroup } from "~/components/ui/radio-group";
import { Switch } from "~/components/ui/switch";
import { Textarea } from "~/components/ui/textarea";
import { getAvailableLinkPosition, setAvailableLinkPosition } from "~/lib/cookies.actions";
import { positionsStore } from "~/lib/stores/positions";
import { UploadDropzone } from "~/lib/uploadthing";
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

  const [parent] = useAutoAnimate();
  const setOptimisticItemPosition = positionsStore((s) => s.getPosition);

  const form = useForm<NewLinkSchema>({
    resolver: zodResolver(newLinkSchema),
    defaultValues: isEditing
      ? defaultValues
      : {
          type: "basic",
          displayText: "",
          url: "",
          position: Math.random() * 1000,
          description: "",
          buttonLabel: "",
          thumbnail: null,
        },
  });

  const isValidURL =
    !!form.watch("url")?.length && z.string().url().safeParse(form.watch("url")).success;

  const linkType = form.watch("type");
  const thumbnail = form.watch("thumbnail");

  const utils = api.useUtils();

  const editLink = api.links.edit.useMutation({
    onSuccess: async () => {
      form.reset();

      await Promise.all([utils.links.all.invalidate(), utils.portals.get.invalidate({ username })]);
    },
    onError: (error) => {
      const e = error as unknown as TRPCError;
      toast.error(e.message);
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
            description: vars.description ?? null,
            buttonLabel: vars.buttonLabel ?? null,
          },
        ]),
      );

      onClose?.();
      return prevData;
    },
    onSuccess: async (data) => {
      toast.success("Link created!");
      form.reset();

      await Promise.all([
        utils.links.all.invalidate(),
        utils.portals.get.invalidate({ username }),
        setAvailableLinkPosition(data?.position ?? 0),
      ]);
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
        position: setOptimisticItemPosition(data.id),
      }),
      {
        loading: "Saving...",
        success: () => {
          onClose?.();
          return "Link updated!";
        },
        error: "Failed to update link",
      },
    );
  });

  useEffect(() => {
    if (defaultValues?.thumbnail ?? form.getValues().thumbnail) {
      form.setValue("thumbnail", defaultValues?.thumbnail ?? form.getValues().thumbnail);
    }
  }, [defaultValues?.thumbnail, form]);

  return (
    <Form {...form}>
      <div>
        <form onSubmit={handleSubmit} className={cn("flex flex-col gap-4", className)} ref={parent}>
          {isEditing && (
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem
                  className={cn(
                    "flex items-center justify-between gap-4 space-y-0 rounded-lg border border-dashed px-4 py-3",
                    !!field.value && "border-indigo-500",
                  )}
                >
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

          <section className="relative flex h-40 justify-center gap-2">
            {thumbnail && (
              <div className="absolute z-0 h-40 w-full overflow-hidden rounded-lg">
                <Image
                  quality={50}
                  className="h-full w-full object-cover"
                  placeholder="blur"
                  blurDataURL={`data:image/png;base64,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dGU6Y3JlYXRlADIwMjQtMDgtMTVUMTc6NTA6NDMrMDA6MDCA6qEpAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDI0LTA4LTE1VDE3OjUwOjQzKzAwOjAw8bcZlQAAABd0RVh0ZXhpZjpZQ2JDclBvc2l0aW9uaW5nADGsD4BjAAAAFnRFWHR0aWZmOlhSZXNvbHV0aW9uADMwMC8xfdCquAAAABZ0RVh0dGlmZjpZUmVzb2x1dGlvbgAzMDAvMfp2YfsAAAAkdEVYdHhtcDpDcmVhdG9yVG9vbABBZG9iZSBTdG9jayBQbGF0Zm9ybTZ+QnEAAAA9dEVYdHhtcE1NOkRvY3VtZW50SUQAeG1wLmlpZDo2YzJhMzI3ZC0wZWQzLTQ1YjAtOGU1Ni1kNDE2ZDU1ZjMwOWUTj4qbAAAAR3RFWHR4bXBNTTpJbnN0YW5jZUlEAGFkb2JlOmRvY2lkOnN0b2NrOjZlYzc2YzFkLTgxMzItNDE2MS05NzkwLTRiYmZlZDAxNGIwMGDVS+kAAAA0dEVYdHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRABhZG9iZTpkb2NpZDpzdG9jazo1OTc0NzQ3OTFHsXJmAAAAAElFTkSuQmCC`}
                  alt={`link-thumbnail`}
                  src={thumbnail}
                  width={320}
                  height={160}
                />
              </div>
            )}

            <UploadDropzone
              input={{ linkId: defaultValues?.id }}
              endpoint="thumbnails"
              className={cn(
                "z-10 mt-0 w-full space-y-2 bg-transparent p-4 transition-all ut-button:h-9 ut-button:w-max ut-button:rounded-md ut-button:px-4 ut-button:text-sm ut-allowed-content:hidden ut-label:font-medium ut-label:text-foreground",
                thumbnail
                  ? "opacity-0 backdrop-blur-lg backdrop-filter duration-300 hover:opacity-100 ut-uploading:bg-indigo-50/50 ut-uploading:opacity-100"
                  : "opacity-100 hover:bg-indigo-50",
              )}
              onClientUploadComplete={async (files) => {
                files.map((file) => {
                  form.setValue("thumbnail", file.url);
                });

                await utils.portals.get.refetch({ username });
              }}
              config={{
                mode: "auto",
              }}
              content={{
                label: () => (
                  <span className="cursor-default rounded-sm bg-muted px-3 py-0.5 text-sm">
                    Upload a thumbnail (optional)
                  </span>
                ),
                uploadIcon: () => <></>,
              }}
            />
          </section>

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

          <FormField
            name="url"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <div className="flex h-5 items-center gap-1">
                  <FormLabel>Link</FormLabel>

                  {isValidURL && (
                    <span className="rounded-full bg-green-100">
                      <CheckCircledIcon className="h-5 w-5 text-green-600" />
                    </span>
                  )}

                  {!isValidURL && !!form.watch("url")?.length && (
                    <span className="rounded-full bg-red-100">
                      <CrossCircledIcon className="h-5 w-5 text-destructive" />
                    </span>
                  )}
                </div>

                <FormControl>
                  <Input placeholder="https://example.com" {...field} value={field.value ?? ""} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="type"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>

                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="grid grid-cols-2 gap-2"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <FormControl>
                        <RadioGroupItem
                          value="basic"
                          className="flex min-h-12 w-full items-center justify-center gap-2 rounded-md border border-border/50 text-sm transition-all duration-200 data-[state=checked]:border-indigo-500 data-[state=checked]:bg-indigo-50 data-[state=checked]:text-indigo-700"
                        >
                          <ExternalLinkIcon />
                          Basic
                        </RadioGroupItem>
                      </FormControl>

                      <FormDescription>Simple button that redirects to a URL</FormDescription>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                      <FormControl>
                        <RadioGroupItem
                          value="deployable"
                          className="flex min-h-12 w-full items-center justify-center gap-2 rounded-md border border-border/50 text-sm transition-all duration-200 data-[state=checked]:border-indigo-500 data-[state=checked]:bg-indigo-50 data-[state=checked]:text-indigo-700"
                        >
                          <FileTextIcon />
                          Deployable
                        </RadioGroupItem>
                      </FormControl>

                      <FormDescription className="text-center">
                        A customizable modal that reveals itself
                      </FormDescription>
                    </div>
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />

          {linkType === "deployable" && (
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>

                  <FormControl>
                    <Textarea
                      placeholder="https://example.com"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>

                  <FormDescription>
                    This will be shown inside the modal, when the link is clicked.
                  </FormDescription>
                </FormItem>
              )}
            />
          )}

          {linkType === "deployable" && (
            <FormField
              control={form.control}
              name="buttonLabel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Button Label</FormLabel>

                  <FormControl>
                    <Input
                      placeholder="See more!"
                      {...field}
                      value={field.value ?? ""}
                      className="max-w-[50%]"
                    />
                  </FormControl>

                  <FormDescription>
                    This will be shown on the button, below the description.
                  </FormDescription>
                </FormItem>
              )}
            />
          )}

          <Button
            size="lg"
            className="mt-4 w-full"
            disabled={form.formState.isSubmitting || editLink.isPending}
          >
            {form.formState.isSubmitting && <Spinner className="text-primary-foreground" />}
            {isEditing ? "Save" : "Add it!"}
          </Button>
        </form>
      </div>
    </Form>
  );
}
