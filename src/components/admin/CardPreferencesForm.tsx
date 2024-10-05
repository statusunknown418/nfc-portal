"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircledIcon, CrossCircledIcon, ResetIcon, ZoomInIcon } from "@radix-ui/react-icons";
import {
  RadioGroupItem as RadioGroupItemRadix,
  RadioGroup as RadioGroupRadix,
} from "@radix-ui/react-radio-group";
import { useForm, useFormContext } from "react-hook-form";
import useFormPersist from "react-hook-form-persist";
import { toast } from "sonner";
import { useAutoSaveFormData } from "~/lib/hooks/use-auto-save";
import { nfcPreferencesStore } from "~/lib/stores/nfcPreferences";
import { UploadDropzone } from "~/lib/uploadthing";
import { basicCardTemplates, cn } from "~/lib/utils";
import { type SaveNFCPreferences, saveNFCPreferencesSchema } from "~/server/api/schemas.zod";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Divider } from "../ui/separator";

export const CardPreferencesForm = () => {
  const setPreferences = nfcPreferencesStore((s) => s.setPreferences);

  const form = useForm<SaveNFCPreferences>({
    resolver: zodResolver(saveNFCPreferencesSchema),
  });

  const hasName = form.watch("showName");
  const hasCompanyName = form.watch("showCompanyName");
  const hasJobTitle = form.watch("showJobTitle");
  const hasCompanyLogo = form.watch("showCompanyLogo");
  const logoURL = form.watch("companyLogoURL");
  const cardVariant = form.watch("cardVariant");
  const imageFront = form.watch("cardImageFront");
  const imageBack = form.watch("cardImageBack");
  const selectedTemplate = form.watch("cardTemplate");

  const handleSubmit = async (data: SaveNFCPreferences) => {
    toast.promise(new Promise((resolve) => resolve(setPreferences(data))), {
      loading: "Saving...",
      success: "Saved!",
      error: (err) => `Failed to save: ${err}`,
    });
  };

  useAutoSaveFormData(200, form, (data) => void handleSubmit(data), []);

  useFormPersist("session:nfc-preferences", {
    ...form,
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex w-full flex-col gap-8">
        <section className="flex flex-col gap-2">
          <h3 className="text-lg font-medium">Choose a card variant</h3>

          <FormField
            name="cardVariant"
            control={form.control}
            render={({ field }) => (
              <RadioGroupRadix value={field.value} onValueChange={field.onChange}>
                <div className="flex gap-4">
                  <DefaultCard />
                  <CustomCard />
                  <MetallicCard />
                </div>
              </RadioGroupRadix>
            )}
          />

          <FormField
            control={form.control}
            name="cardTemplate"
            render={({ field }) => (
              <FormItem
                className={cn(
                  "mt-4 h-auto opacity-100 transition-all",
                  cardVariant !== "basic" && "pointer-events-none hidden h-0 opacity-0",
                )}
              >
                <Label className="text-lg">Template</Label>

                <RadioGroupRadix value={field.value} onValueChange={field.onChange}>
                  <div className="relative flex min-h-40 min-w-full gap-2">
                    {basicCardTemplates.map((template, idx) => (
                      <TemplateCard
                        key={template.value}
                        style={{
                          left: `${idx * 120}px`,
                        }}
                        value={template.value}
                        className={cn(
                          selectedTemplate === template.value &&
                            "z-10 opacity-100 ring ring-ring ring-offset-1",
                          "absolute top-0 transition-all hover:z-20 hover:translate-x-10 hover:translate-y-10",
                        )}
                        front={template.front}
                        back={template.back}
                      />
                    ))}
                  </div>
                </RadioGroupRadix>
              </FormItem>
            )}
          />

          <div
            className={cn(
              // Fixed height and width to maintain card aspect ratio
              "mt-4 flex max-w-max flex-col gap-2 rounded-lg px-3 pb-2 pt-1",
              cardVariant !== "custom" && "pointer-events-none mt-0 h-0 opacity-0",
            )}
          >
            <Alert variant="warning" className="mb-2 max-w-lg">
              <AlertTitle>Heads up!</AlertTitle>

              <AlertDescription>
                By choosing this option you are able fully customize the appearance of your card,
                however <strong>it will be delivered AS IS</strong>, so make sure you add all the
                details you want to be visible on the card.
              </AlertDescription>
            </Alert>

            <article
              className={cn(
                "mt-2 flex w-full flex-grow flex-col items-center gap-2 transition-all",
                cardVariant !== "custom" && "pointer-events-none mt-0 h-0 opacity-0",
              )}
            >
              <Label className="flex items-center gap-2">
                <ResetIcon className="rotate-180" />
                Front card design
              </Label>

              <section
                className={cn(
                  "relative flex h-[240px] w-[420px] flex-col justify-center bg-contain bg-center bg-no-repeat",
                )}
                style={{
                  backgroundImage: `url(${imageFront})`,
                }}
              >
                <UploadDropzone
                  endpoint="logos"
                  className={cn(
                    "z-10 mt-0 h-full w-full space-y-2 bg-transparent p-4 transition-all ut-button:h-9 ut-button:w-max ut-button:rounded-md ut-button:px-4 ut-button:text-sm ut-allowed-content:hidden ut-label:font-medium ut-label:text-foreground",
                    imageFront
                      ? "opacity-0 backdrop-blur-lg backdrop-filter duration-300 hover:opacity-100 ut-uploading:bg-indigo-50/50 ut-uploading:opacity-100"
                      : "opacity-100 hover:bg-indigo-50",
                  )}
                  onClientUploadComplete={async (files) => {
                    files.map((file) => {
                      form.setValue("cardImageFront", file.url);
                    });
                  }}
                  config={{
                    mode: "auto",
                  }}
                  content={{
                    label: () => (
                      <span className="cursor-default rounded-sm bg-muted px-3 py-0.5 text-sm">
                        1050x600 pixels for the best quality
                      </span>
                    ),
                    uploadIcon: () => <></>,
                  }}
                />
              </section>

              <Button
                variant="destructive_ghost"
                size="sm"
                className="w-max self-center"
                onClick={() => form.setValue("cardImageFront", undefined)}
              >
                Remove design
              </Button>
            </article>

            <Divider className="my-5" />

            <article
              className={cn(
                "relative flex w-full flex-grow flex-col items-center gap-2 transition-all",
                cardVariant !== "custom" && "pointer-events-none mt-0 h-0 opacity-0",
              )}
            >
              <Label className="flex items-center gap-2">
                <ResetIcon />
                Back card design
              </Label>

              <section
                className={cn(
                  "relative flex h-[240px] w-[420px] flex-col justify-center bg-contain bg-center bg-no-repeat",
                )}
                style={{
                  backgroundImage: `url(${imageBack})`,
                }}
              >
                <UploadDropzone
                  endpoint="logos"
                  className={cn(
                    "z-10 mt-0 h-full w-full space-y-2 bg-transparent p-4 transition-all ut-button:h-8 ut-button:w-max ut-button:rounded-md ut-button:px-4 ut-button:text-sm ut-allowed-content:hidden ut-label:font-medium ut-label:text-foreground",
                    imageBack
                      ? "opacity-0 backdrop-blur-lg backdrop-filter duration-300 hover:opacity-100 ut-uploading:bg-indigo-50/50 ut-uploading:opacity-100"
                      : "opacity-100 hover:bg-indigo-50",
                  )}
                  onClientUploadComplete={async (files) => {
                    files.map((file) => {
                      form.setValue("cardImageBack", file.url);
                    });
                  }}
                  config={{
                    mode: "auto",
                  }}
                  content={{
                    label: () => (
                      <span className="cursor-default rounded-sm bg-muted px-3 py-0.5 text-sm">
                        1050x600 pixels for the best quality
                      </span>
                    ),
                    uploadIcon: () => <></>,
                  }}
                />
              </section>

              <Button
                variant="destructive_ghost"
                size="sm"
                className="w-max self-center"
                onClick={() => form.setValue("cardImageBack", undefined)}
              >
                Remove design
              </Button>
            </article>
          </div>
        </section>

        <section
          className={cn(
            "flex w-full flex-col gap-4 transition-transform",
            cardVariant === "custom" && "pointer-events-none mt-0 h-0 opacity-0",
          )}
        >
          <div className="space-y-1">
            <h3 className="text-lg font-medium">What should it show?</h3>

            <p className="text-sm font-normal text-muted-foreground">
              The contact info you added in the first step will be used to personalize the card as
              you see fit.
            </p>
          </div>

          <div className="grid w-full grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="showName"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-3">
                    <FormControl>
                      <Checkbox
                        className="h-5 w-5"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>

                    <FormLabel className="text-base">Your name</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              name="nameOnFront"
              control={form.control}
              render={({ field }) => (
                <FormItem className={cn(hasName ? "opacity-100" : "opacity-0")}>
                  <div className={cn("flex items-center gap-3")}>
                    <FormLabel
                      className={cn(
                        "transition-opacity",
                        !field.value ? "opacity-100" : "opacity-0",
                      )}
                    >
                      Back
                    </FormLabel>

                    <FormControl>
                      <Switch
                        disabled={!hasName}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=unchecked]:bg-purple-500"
                      />
                    </FormControl>

                    <FormLabel
                      className={cn(
                        "transition-opacity",
                        !!field.value ? "opacity-100" : "opacity-0",
                      )}
                    >
                      Front
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              name="showJobTitle"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-3">
                    <FormControl>
                      <Checkbox
                        className="h-5 w-5"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>

                    <FormLabel className="text-base">Job title / Position</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="jobTitleOnFront"
              render={({ field }) => (
                <FormItem className={cn(hasJobTitle ? "opacity-100" : "opacity-0")}>
                  <div className={cn("flex items-center gap-3")}>
                    <FormLabel
                      className={cn(
                        "transition-opacity",
                        !field.value ? "opacity-100" : "opacity-0",
                      )}
                    >
                      Back
                    </FormLabel>

                    <FormControl>
                      <Switch
                        disabled={!hasJobTitle}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=unchecked]:bg-purple-500"
                      />
                    </FormControl>

                    <FormLabel
                      className={cn(
                        "transition-opacity",
                        !!field.value ? "opacity-100" : "opacity-0",
                      )}
                    >
                      Front
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              name="showCompanyName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-3">
                    <FormControl>
                      <Checkbox
                        className="h-5 w-5"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>

                    <FormLabel className="text-base">Company name</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="companyNameOnFront"
              render={({ field }) => (
                <FormItem className={cn(hasCompanyName ? "opacity-100" : "opacity-0")}>
                  <div className={cn("flex items-center gap-3")}>
                    <FormLabel
                      className={cn(
                        "transition-opacity",
                        !field.value ? "opacity-100" : "opacity-0",
                      )}
                    >
                      Back
                    </FormLabel>

                    <FormControl>
                      <Switch
                        disabled={!hasCompanyName}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=unchecked]:bg-purple-500"
                      />
                    </FormControl>

                    <FormLabel
                      className={cn(
                        "transition-opacity",
                        !!field.value ? "opacity-100" : "opacity-0",
                      )}
                    >
                      Front
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="showCompanyLogo"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-3">
                    <FormControl>
                      <Checkbox
                        className="h-5 w-5"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>

                    <FormLabel className="text-base">Company logo</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="companyLogoOnFront"
              render={({ field }) => (
                <FormItem className={cn(hasCompanyLogo ? "opacity-100" : "opacity-0")}>
                  <div className={cn("flex items-center gap-3")}>
                    <FormLabel
                      className={cn(
                        "transition-opacity",
                        !field.value ? "opacity-100" : "opacity-0",
                      )}
                    >
                      Back
                    </FormLabel>

                    <FormControl>
                      <Switch
                        disabled={!hasCompanyLogo}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=unchecked]:bg-purple-500"
                      />
                    </FormControl>

                    <FormLabel
                      className={cn(
                        "transition-opacity",
                        !!field.value ? "opacity-100" : "opacity-0",
                      )}
                    >
                      Front
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <div
              className={cn(
                "flex flex-col gap-2 rounded-lg bg-muted px-3 py-1 transition-all",
                !hasCompanyLogo && "pointer-events-none h-0 opacity-0",
              )}
            >
              <section
                className={cn(
                  "relative flex h-[140px] flex-col justify-center bg-contain bg-center bg-no-repeat",
                )}
                style={{
                  backgroundImage: `url(${logoURL})`,
                }}
              >
                <UploadDropzone
                  endpoint="logos"
                  className={cn(
                    "z-10 mt-0 h-full w-full space-y-2 bg-transparent p-4 transition-all ut-button:h-9 ut-button:w-max ut-button:rounded-md ut-button:px-4 ut-button:text-sm ut-allowed-content:hidden ut-label:font-medium ut-label:text-foreground",
                    logoURL
                      ? "opacity-0 backdrop-blur-lg backdrop-filter duration-300 hover:opacity-100 ut-uploading:bg-indigo-50/50 ut-uploading:opacity-100"
                      : "opacity-100 hover:bg-indigo-50",
                  )}
                  onClientUploadComplete={async (files) => {
                    files.map((file) => {
                      form.setValue("companyLogoURL", file.url);
                    });
                  }}
                  config={{
                    mode: "auto",
                  }}
                  content={{
                    label: () => (
                      <span className="cursor-default rounded-sm bg-muted px-3 py-0.5 text-sm">
                        Upload a company logo
                      </span>
                    ),
                    uploadIcon: () => <></>,
                  }}
                />
              </section>

              <Button
                className="max-w-max self-center"
                variant="destructive_ghost"
                onClick={() => form.setValue("companyLogoURL", undefined)}
              >
                Remove logo
              </Button>
            </div>
          </div>
        </section>
      </form>
    </Form>
  );
};

const DefaultCard = () => {
  return (
    <RadioGroupItemRadix
      className="h-28 w-52 rounded-lg border bg-background p-4 text-black shadow transition-all data-[state=checked]:ring data-[state=checked]:ring-ring data-[state=checked]:ring-offset-1"
      value="basic"
    >
      <h4>Classic Edition</h4>
    </RadioGroupItemRadix>
  );
};

const TemplateCard = ({
  className,
  front,
  back,
  value,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
  front: string;
  back: string;
  value: string;
}) => {
  const form = useFormContext<SaveNFCPreferences>();
  const currentTemplate = form.watch("cardTemplate");

  return (
    <Dialog modal>
      <DialogTrigger asChild>
        <button
          style={{
            ...style,
            backgroundImage: `url(${front})`,
          }}
          className={cn(
            "h-40 w-64 rounded-lg border bg-cover bg-center bg-no-repeat p-4 shadow-md transition-all hover:scale-125 hover:opacity-100",
            currentTemplate && "opacity-80",
            className,
          )}
        >
          <Badge size="lg">
            <ZoomInIcon className="h-5 w-5" />
            See details
          </Badge>
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Detailed view</DialogTitle>
        </DialogHeader>

        <section className="flex h-full min-h-max w-full items-center gap-2">
          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">Front card preview</p>

            <Image
              src={front}
              alt="front-template-design"
              width={350}
              height={200}
              className="rounded-lg border shadow-lg"
            />
          </div>

          <ResetIcon className="mt-4 h-5 w-5 text-muted-foreground" />

          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">Back card preview</p>
            <Image
              src={back}
              alt="back-template-design"
              width={350}
              height={200}
              className="rounded-lg border shadow-lg"
            />
          </div>
        </section>

        <DialogFooter>
          <Button
            variant={currentTemplate === value ? "destructive_ghost" : "primary_ghost"}
            onClick={() => {
              if (currentTemplate === value) {
                form.setValue("cardTemplate", undefined);
              } else {
                form.setValue("cardTemplate", value);
              }
            }}
          >
            {currentTemplate === value ? <CrossCircledIcon /> : <CheckCircledIcon />}
            {currentTemplate === value ? "Deselect" : "Select"}
          </Button>

          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const CustomCard = () => {
  return (
    <RadioGroupItemRadix
      className="h-28 w-52 rounded-lg border bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4 shadow-md transition-all data-[state=checked]:ring data-[state=checked]:ring-ring data-[state=checked]:ring-offset-1"
      value="custom"
    >
      <h4 className="bg-clip-text font-medium text-white">Professional Edition (custom)</h4>
    </RadioGroupItemRadix>
  );
};

const MetallicCard = () => {
  return (
    <div className="cursor-not-allowed opacity-50">
      <section className="flex h-28 w-52 flex-col items-center justify-center rounded-lg border border-dashed bg-gradient-to-r from-zinc-400 via-transparent to-zinc-400 p-4 shadow-lg transition-all data-[state=checked]:ring data-[state=checked]:ring-ring data-[state=checked]:ring-offset-1">
        <h4 className="font-bold text-primary">Metallic</h4>
        <p className="mt-1 text-center text-sm">Coming soon...</p>
      </section>
    </div>
  );
};
