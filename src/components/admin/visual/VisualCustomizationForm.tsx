"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ColorWheelIcon,
  CubeIcon,
  FileTextIcon,
  ImageIcon,
  PaperPlaneIcon,
} from "@radix-ui/react-icons";
import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
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
import { Divider } from "~/components/ui/separator";
import { Textarea } from "~/components/ui/textarea";
import { UploadDropzone } from "~/lib/uploadthing";
import { cn } from "~/lib/utils";
import {
  editVisualCustomizationSchema,
  type EditVisualCustomizationSchema,
} from "~/server/db/schema";
import { api, type RouterOutputs } from "~/trpc/react";

export const VisualCustomizationForm = ({
  defaultValues,
}: {
  defaultValues: RouterOutputs["visuals"]["get"];
}) => {
  const form = useForm<EditVisualCustomizationSchema>({
    defaultValues: !!defaultValues
      ? {
          ...defaultValues,
          pageLayout: defaultValues.pageLayout ?? "basic",
          bio: defaultValues.bio ?? "",
        }
      : undefined,
    resolver: zodResolver(editVisualCustomizationSchema),
  });

  const mutate = api.visuals.edit.useMutation();
  const [avatar, setAvatar] = useState(defaultValues?.image);

  const handleSubmit = async (data: EditVisualCustomizationSchema) => {
    toast.promise(mutate.mutateAsync(data), {
      loading: "Saving...",
      success: "Done!",
      error: "Failed to save",
    });
  };

  const anyFieldTouched = form.formState.isDirty;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="mt-2 grid grid-cols-1 gap-6 pb-12"
      >
        {!!anyFieldTouched && (
          <section className="fixed right-1/2 top-10 flex w-full max-w-3xl translate-x-1/2 items-center justify-between gap-4 rounded-lg border border-destructive bg-red-50 px-8 py-4 shadow-lg">
            <p>Careful, you have unsaved changes!</p>

            <div className="flex gap-2">
              <Button size="lg">
                <PaperPlaneIcon />
                Save
              </Button>

              <Button variant="outline" size="lg">
                Reset / Undo
              </Button>
            </div>
          </section>
        )}

        <section className="flex flex-col justify-between gap-4 md:flex-row">
          <article className="flex flex-col gap-4 rounded-lg border p-6">
            <h2 className="text-lg font-semibold">Avatar</h2>

            <section className="relative flex h-[320px] w-[200px] justify-center gap-2">
              {avatar && (
                <div className="absolute z-0 h-[320px] w-[200px] overflow-hidden rounded-lg border">
                  <Image
                    className="h-full w-full object-cover"
                    placeholder="blur"
                    blurDataURL={`data:image/png;base64,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dGU6Y3JlYXRlADIwMjQtMDgtMTVUMTc6NTA6NDMrMDA6MDCA6qEpAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDI0LTA4LTE1VDE3OjUwOjQzKzAwOjAw8bcZlQAAABd0RVh0ZXhpZjpZQ2JDclBvc2l0aW9uaW5nADGsD4BjAAAAFnRFWHR0aWZmOlhSZXNvbHV0aW9uADMwMC8xfdCquAAAABZ0RVh0dGlmZjpZUmVzb2x1dGlvbgAzMDAvMfp2YfsAAAAkdEVYdHhtcDpDcmVhdG9yVG9vbABBZG9iZSBTdG9jayBQbGF0Zm9ybTZ+QnEAAAA9dEVYdHhtcE1NOkRvY3VtZW50SUQAeG1wLmlpZDo2YzJhMzI3ZC0wZWQzLTQ1YjAtOGU1Ni1kNDE2ZDU1ZjMwOWUTj4qbAAAAR3RFWHR4bXBNTTpJbnN0YW5jZUlEAGFkb2JlOmRvY2lkOnN0b2NrOjZlYzc2YzFkLTgxMzItNDE2MS05NzkwLTRiYmZlZDAxNGIwMGDVS+kAAAA0dEVYdHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRABhZG9iZTpkb2NpZDpzdG9jazo1OTc0NzQ3OTFHsXJmAAAAAElFTkSuQmCC`}
                    alt={`profile-avatar`}
                    src={avatar}
                    width={200}
                    height={320}
                  />
                </div>
              )}

              <UploadDropzone
                endpoint="avatars"
                className={cn(
                  "z-10 mt-0 w-full space-y-2 bg-transparent p-4 transition-all ut-button:h-9 ut-button:w-max ut-button:rounded-md ut-button:px-4 ut-button:text-sm ut-allowed-content:hidden ut-label:font-medium ut-label:text-foreground",
                  avatar
                    ? "opacity-0 backdrop-blur-lg backdrop-filter duration-300 hover:opacity-100 ut-uploading:bg-indigo-50/50 ut-uploading:opacity-100"
                    : "opacity-100 hover:bg-indigo-50",
                )}
                onClientUploadComplete={(files) => {
                  files.map((f) => {
                    setAvatar(f.url);
                  });
                }}
                config={{
                  mode: "auto",
                }}
                content={{
                  label: () => (
                    <span className="cursor-default rounded-sm bg-muted px-3 py-0.5 text-sm">
                      Upload an avatar (optional)
                    </span>
                  ),
                }}
              />
            </section>

            <ul className="flex w-full flex-col gap-2">
              <Button variant="outline" type="button" className="w-full">
                Replace with generated
              </Button>

              <Button
                variant="destructive_ghost"
                type="button"
                className="w-full border-destructive/50 bg-destructive/10 hover:bg-destructive/20"
              >
                Remove avatar
              </Button>
            </ul>
          </article>

          <article className="flex flex-grow flex-col gap-4 rounded-lg border p-6">
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-lg font-semibold">Profile header</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value ?? ""}
                      rows={2}
                      placeholder="Software engineer @ Stackk Studios."
                    />
                  </FormControl>

                  <FormDescription>Main heading on your public portal page.</FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-lg font-semibold">Biography</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={5}
                      {...field}
                      value={field.value ?? ""}
                      placeholder="I try to build cool stuff without breaking it..."
                    />
                  </FormControl>

                  <FormDescription>
                    Anything you want to tell people about yourself. This will be displayed on your
                    profile page.
                  </FormDescription>
                </FormItem>
              )}
            />
          </article>
        </section>

        <article>
          <h3 className="text-xl font-medium">Themes</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            These are curated themes that you can use for your public portal page
          </p>
        </article>

        <section className="rounded-lg border p-6">
          <FormField
            control={form.control}
            name="theme.buttons.type"
            render={({ field }) => (
              <FormItem>
                <RadioGroup
                  className="grid grid-cols-4 gap-4"
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <div className="flex flex-col items-center gap-2">
                    <FormControl>
                      <RadioGroupItem
                        value="basic"
                        className="flex h-60 w-[136px] items-center justify-center gap-2 rounded-md border border-border/50 text-sm ring-offset-2 transition-all duration-200 data-[state=checked]:shadow-lg data-[state=checked]:ring data-[state=checked]:ring-ring"
                      />
                    </FormControl>

                    <Label>Minimal</Label>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <FormControl>
                      <RadioGroupItem
                        value="basic"
                        className="flex h-60 w-[136px] items-center justify-center gap-2 rounded-md border border-border/50 text-sm ring-offset-2 transition-all duration-200 data-[state=checked]:shadow-lg data-[state=checked]:ring data-[state=checked]:ring-ring"
                      />
                    </FormControl>

                    <Label>Crazy</Label>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <FormControl>
                      <RadioGroupItem
                        value="basic"
                        className="flex h-60 w-[136px] items-center justify-center gap-2 rounded-md border border-border/50 text-sm ring-offset-2 transition-all duration-200 data-[state=checked]:shadow-lg data-[state=checked]:ring data-[state=checked]:ring-ring"
                      />
                    </FormControl>

                    <Label>Blurry</Label>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <FormControl>
                      <RadioGroupItem
                        value="basic"
                        className="flex h-60 w-[136px] items-center justify-center gap-2 rounded-md border border-border/50 text-sm ring-offset-2 transition-all duration-200 data-[state=checked]:shadow-lg data-[state=checked]:ring data-[state=checked]:ring-ring"
                      />
                    </FormControl>

                    <Label>Stripes</Label>
                  </div>
                </RadioGroup>
              </FormItem>
            )}
          />
        </section>

        <Divider>Or build your own</Divider>

        <article>
          <h3 className="text-xl font-medium">Custom theme</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            We provide a few presets, but you can also build your own!
          </p>
        </article>

        <section className="flex flex-col gap-2 rounded-lg border p-6">
          <h2 className="text-lg font-semibold">Color palette</h2>

          <article className="grid grid-cols-2 gap-4">
            <FormItem>
              <Label>Background type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="solid">
                    <CubeIcon />
                    Solid
                  </SelectItem>
                  <SelectItem value="gradient">
                    <ColorWheelIcon />
                    Gradient
                  </SelectItem>
                  <SelectItem value="image">
                    <ImageIcon />
                    Image
                  </SelectItem>
                </SelectContent>
              </Select>
            </FormItem>

            <FormItem>
              <Label>Background color</Label>
              <Input type="color" />
            </FormItem>
          </article>
        </section>

        <section className="flex flex-col gap-2 rounded-lg border p-6">
          <h2 className="text-lg font-semibold">Typography</h2>

          <article className="grid grid-cols-2 gap-4">
            <FormItem>
              <Label>Font family</Label>

              <Select>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="inter">Inter</SelectItem>
                  <SelectItem value="roboto">Roboto </SelectItem>
                  <SelectItem value="poppins">Lato</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>

            <FormItem>
              <Label>Font size</Label>
              <Input />
            </FormItem>
          </article>
        </section>

        <section className="flex flex-col gap-2 rounded-lg border p-6">
          <h2 className="text-lg font-semibold">Button style</h2>

          <FormField
            control={form.control}
            name="theme.buttons.type"
            render={({}) => (
              <FormItem>
                <Label>Shape</Label>

                <RadioGroup className="grid grid-cols-2 gap-4">
                  <RadioGroupItem
                    value="basic"
                    className="flex min-h-12 w-full items-center justify-center gap-2 rounded-md border border-border/50 text-sm ring-offset-2 transition-all duration-200 data-[state=checked]:ring data-[state=checked]:ring-ring"
                  >
                    Click here!
                  </RadioGroupItem>

                  <FormControl>
                    <RadioGroupItem
                      value="deployable"
                      className="flex min-h-12 w-full items-center justify-center gap-2 rounded-md border border-border/50 text-sm ring-offset-2 transition-all duration-200 data-[state=checked]:ring data-[state=checked]:ring-ring"
                    >
                      <FileTextIcon />
                      Deployable
                    </RadioGroupItem>
                  </FormControl>
                </RadioGroup>
              </FormItem>
            )}
          />
        </section>
      </form>
    </Form>
  );
};
