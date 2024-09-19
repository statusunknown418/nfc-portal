"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CircleIcon, Component2Icon, SquareIcon } from "@radix-ui/react-icons";
import {
  RadioGroup as RadixRadioGroup,
  RadioGroupItem as RadixRadioGroupItem,
} from "@radix-ui/react-radio-group";
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
import { GradientPicker } from "~/components/ui/gradient-picker";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Divider } from "~/components/ui/separator";
import { Switch } from "~/components/ui/switch";
import { Textarea } from "~/components/ui/textarea";
import { useAutoSaveFormData } from "~/lib/hooks/use-auto-save";
import { UploadDropzone } from "~/lib/uploadthing";
import { BASE_THEMES, cn, type ThemeKeys } from "~/lib/utils";
import {
  type AvatarShape,
  editVisualCustomizationSchema,
  type EditVisualCustomizationSchema,
} from "~/server/db/schema";
import { api, type RouterOutputs } from "~/trpc/react";

export const VisualCustomizationForm = ({
  defaultValues,
  username,
}: {
  defaultValues: RouterOutputs["visuals"]["get"];
  username: string;
}) => {
  const form = useForm<EditVisualCustomizationSchema>({
    defaultValues: !!defaultValues
      ? {
          ...defaultValues,
          pageLayout: defaultValues.pageLayout ?? "basic",
          bio: defaultValues.bio ?? "",
        }
      : {
          theme: BASE_THEMES.default,
        },
    resolver: zodResolver(editVisualCustomizationSchema),
  });

  const utils = api.useUtils();

  const mutate = api.visuals.edit.useMutation({
    onSuccess: () => {
      void utils.portals.get.invalidate({ username });
    },
  });

  const [enableCustom, setEnableCustom] = useState(
    defaultValues?.theme.themeKey === "custom" || false,
  );
  const [avatar, setAvatar] = useState(defaultValues?.image);
  const [avatarShape, setAvatarShape] = useState(defaultValues?.avatarShape);

  const handleSubmit = async (data: EditVisualCustomizationSchema) => {
    toast.promise(mutate.mutateAsync(data), {
      loading: "Saving...",
      success: "Done!",
      error: (err) => `Failed to save: ${err}`,
    });
  };

  const handleEnableCustom = (enable: boolean) => {
    if (enable) {
      form.setValue("theme.themeKey", "custom");
    } else {
      form.setValue("theme", BASE_THEMES.default);
    }

    setEnableCustom(enable);
  };

  useAutoSaveFormData(500, form, (data) => void handleSubmit(data), []);

  return (
    <Form {...form}>
      <form className="mt-2 grid grid-cols-1 gap-6 pb-12">
        <section className="flex flex-col justify-between gap-4 md:flex-row">
          <article className="flex flex-col gap-4 rounded-lg border p-6">
            <h2 className="text-lg font-semibold">Avatar</h2>

            <section className="relative flex h-[200px] w-[200px] justify-center gap-2">
              {avatar && (
                <div
                  className={cn(
                    "absolute z-0 h-[200px] w-[200px] overflow-hidden rounded-lg border",
                    {
                      "self-center rounded-full": avatarShape === "circle",
                      "self-center rounded-none": avatarShape === "square",
                    },
                  )}
                >
                  <Image
                    fill
                    className="object-cover"
                    placeholder="blur"
                    blurDataURL={`data:image/png;base64,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dGU6Y3JlYXRlADIwMjQtMDgtMTVUMTc6NTA6NDMrMDA6MDCA6qEpAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDI0LTA4LTE1VDE3OjUwOjQzKzAwOjAw8bcZlQAAABd0RVh0ZXhpZjpZQ2JDclBvc2l0aW9uaW5nADGsD4BjAAAAFnRFWHR0aWZmOlhSZXNvbHV0aW9uADMwMC8xfdCquAAAABZ0RVh0dGlmZjpZUmVzb2x1dGlvbgAzMDAvMfp2YfsAAAAkdEVYdHhtcDpDcmVhdG9yVG9vbABBZG9iZSBTdG9jayBQbGF0Zm9ybTZ+QnEAAAA9dEVYdHhtcE1NOkRvY3VtZW50SUQAeG1wLmlpZDo2YzJhMzI3ZC0wZWQzLTQ1YjAtOGU1Ni1kNDE2ZDU1ZjMwOWUTj4qbAAAAR3RFWHR4bXBNTTpJbnN0YW5jZUlEAGFkb2JlOmRvY2lkOnN0b2NrOjZlYzc2YzFkLTgxMzItNDE2MS05NzkwLTRiYmZlZDAxNGIwMGDVS+kAAAA0dEVYdHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRABhZG9iZTpkb2NpZDpzdG9jazo1OTc0NzQ3OTFHsXJmAAAAAElFTkSuQmCC`}
                    alt={`profile-avatar`}
                    src={avatar}
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
              name="avatarShape"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Avatar shape</FormLabel>

                  <Select
                    defaultValue={field.value}
                    onValueChange={(v) => {
                      setAvatarShape(v as AvatarShape);
                      field.onChange(v);
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue className="select-none" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      <SelectItem value="circle">
                        <CircleIcon className="h-5 w-5 text-indigo-600" />
                        Circle
                      </SelectItem>
                      <SelectItem value="rounded">
                        <Component2Icon className="h-5 w-5 text-cyan-600" />
                        Rounded
                      </SelectItem>
                      <SelectItem value="square">
                        <SquareIcon className="h-5 w-5 text-amber-600" />
                        Square
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <Divider className="my-3" colorClassName="bg-zinc-300" />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-lg font-semibold">Biography</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={5}
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
            name="theme.themeKey"
            render={({ field }) => (
              <FormItem>
                <RadixRadioGroup
                  className="flex flex-wrap gap-4"
                  value={field.value}
                  onValueChange={(v) => {
                    if (v === "custom") {
                      handleEnableCustom(true);
                    } else {
                      setEnableCustom(false);
                      form.setValue("theme", BASE_THEMES[v as ThemeKeys]);
                      field.onChange(v);
                    }
                  }}
                >
                  <div className="flex flex-col items-center gap-2">
                    <FormControl>
                      <RadixRadioGroupItem
                        value="custom"
                        className="flex h-64 w-[138px] items-center justify-center gap-2 rounded-md border border-border/50 text-sm ring-offset-2 transition-all duration-200 data-[state=checked]:shadow-lg data-[state=checked]:ring data-[state=checked]:ring-ring"
                      />
                    </FormControl>

                    <Label>Customized</Label>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <FormControl>
                      <RadixRadioGroupItem
                        value="default"
                        className="flex h-64 w-[138px] items-center justify-center gap-2 rounded-md border border-border/50 text-sm ring-offset-2 transition-all duration-200 data-[state=checked]:shadow-lg data-[state=checked]:ring data-[state=checked]:ring-ring"
                      />
                    </FormControl>

                    <Label>Default</Label>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <FormControl>
                      <RadixRadioGroupItem
                        value="minimal"
                        className="flex h-64 w-[138px] items-center justify-center gap-2 rounded-md border border-border/50 text-sm ring-offset-2 transition-all duration-200 data-[state=checked]:shadow-lg data-[state=checked]:ring data-[state=checked]:ring-ring"
                      />
                    </FormControl>

                    <Label>Minimal</Label>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <FormControl>
                      <RadixRadioGroupItem
                        value="crazy"
                        className="flex h-64 w-[138px] items-center justify-center gap-2 rounded-md border border-border/50 text-sm ring-offset-2 transition-all duration-200 data-[state=checked]:shadow-lg data-[state=checked]:ring data-[state=checked]:ring-ring"
                      />
                    </FormControl>

                    <Label>Cool</Label>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <FormControl>
                      <RadixRadioGroupItem
                        value="blurry"
                        className="flex h-64 w-[138px] items-center justify-center gap-2 rounded-md border border-border/50 text-sm ring-offset-2 transition-all duration-200 data-[state=checked]:shadow-lg data-[state=checked]:ring data-[state=checked]:ring-ring"
                      />
                    </FormControl>

                    <Label>Blurry</Label>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <FormControl>
                      <RadixRadioGroupItem
                        value="stripes"
                        className="flex h-64 w-[138px] items-center justify-center gap-2 rounded-md border border-border/50 text-sm ring-offset-2 transition-all duration-200 data-[state=checked]:shadow-lg data-[state=checked]:ring data-[state=checked]:ring-ring"
                      />
                    </FormControl>

                    <Label>Stripes</Label>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <FormControl>
                      <RadixRadioGroupItem
                        value="modern"
                        className="flex h-64 w-[140px] items-center justify-center gap-2 rounded-md border border-border/50 text-sm ring-offset-2 transition-all duration-200 data-[state=checked]:shadow-lg data-[state=checked]:ring data-[state=checked]:ring-ring"
                      />
                    </FormControl>

                    <Label>Modern</Label>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <FormControl>
                      <RadixRadioGroupItem
                        value="pro"
                        className="flex h-64 w-[138px] items-center justify-center gap-2 rounded-md border border-border/50 text-sm ring-offset-2 transition-all duration-200 data-[state=checked]:shadow-lg data-[state=checked]:ring data-[state=checked]:ring-ring"
                      />
                    </FormControl>

                    <Label>Pro</Label>
                  </div>
                </RadixRadioGroup>
              </FormItem>
            )}
          />
        </section>

        <Divider>
          <div className="flex items-center gap-2 px-4">
            <Label htmlFor="enable-customization" className="text-foreground">
              I want to build my own theme
            </Label>

            <Switch
              id="enable-customization"
              checked={enableCustom}
              onCheckedChange={handleEnableCustom}
            />
          </div>
        </Divider>

        <article
          className={cn("translate-y-0 transition-transform duration-300", {
            "h-0 translate-y-10 opacity-0": !enableCustom,
          })}
        >
          <h3 className="text-xl font-medium">Custom theme</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            We provide a few presets, but you can also build your own!
          </p>
        </article>

        <section
          className={cn(
            "flex translate-y-0 flex-col gap-2 rounded-lg border p-6 transition-transform duration-300",
            {
              "h-0 translate-y-10 opacity-0": !enableCustom,
            },
          )}
        >
          <h2 className="text-lg font-semibold">Color palette</h2>

          <article className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="theme.colors.background"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Background</FormLabel>

                  <GradientPicker background={field.value} setBackground={field.onChange} />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="theme.colors.subtle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Accent (subtle)</FormLabel>

                  <GradientPicker background={field.value} setBackground={field.onChange} />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="theme.colors.foreground"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Foreground</FormLabel>

                  <GradientPicker background={field.value} setBackground={field.onChange} />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="theme.colors.border"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Border color</FormLabel>

                  <GradientPicker background={field.value} setBackground={field.onChange} />
                </FormItem>
              )}
            />
          </article>
        </section>

        <section
          className={cn(
            "flex translate-y-0 flex-col gap-2 rounded-lg border p-6 transition-transform duration-300",
            {
              "h-0 translate-y-10 opacity-0": !enableCustom,
            },
          )}
        >
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

        <section
          className={cn(
            "flex translate-y-0 flex-col gap-2 rounded-lg border p-6 transition-transform duration-300",
            {
              "h-0 translate-y-10 opacity-0": !enableCustom,
            },
          )}
        >
          <h2 className="text-lg font-semibold">Button style</h2>

          <FormField
            control={form.control}
            name="theme.buttons.rounding"
            render={({}) => (
              <FormItem>
                <Label>Shape</Label>

                <RadioGroup className="grid grid-cols-2 gap-4">
                  <RadixRadioGroupItem
                    value="9999px"
                    className="flex min-h-12 w-full items-center justify-center gap-2 rounded-md border border-border/50 text-sm ring-offset-2 transition-all duration-200 data-[state=checked]:ring data-[state=checked]:ring-ring"
                  >
                    Pill rouding
                  </RadixRadioGroupItem>

                  <FormControl>
                    <RadioGroupItem
                      value="14px"
                      className="flex min-h-12 w-full items-center justify-center gap-2 rounded-md border border-border/50 text-sm ring-offset-2 transition-all duration-200 data-[state=checked]:ring data-[state=checked]:ring-ring"
                    >
                      Medium rouding
                    </RadioGroupItem>
                  </FormControl>

                  <FormControl>
                    <RadioGroupItem
                      value="8px"
                      className="flex min-h-12 w-full items-center justify-center gap-2 rounded-md border border-border/50 text-sm ring-offset-2 transition-all duration-200 data-[state=checked]:ring data-[state=checked]:ring-ring"
                    >
                      Small rouding
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
