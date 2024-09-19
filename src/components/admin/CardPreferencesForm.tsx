"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ResetIcon } from "@radix-ui/react-icons";
import {
  RadioGroupItem as RadioGroupItemRadix,
  RadioGroup as RadioGroupRadix,
} from "@radix-ui/react-radio-group";
import Image from "next/image";
import { useForm } from "react-hook-form";
import useFormPersist from "react-hook-form-persist";
import { toast } from "sonner";
import { useAutoSaveFormData } from "~/lib/hooks/use-auto-save";
import { nfcPreferencesStore } from "~/lib/stores/nfcPreferences";
import { UploadDropzone } from "~/lib/uploadthing";
import { cn } from "~/lib/utils";
import { type SaveNFCPreferences, saveNFCPreferencesSchema } from "~/server/api/schemas.zod";
import { Checkbox } from "../ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";

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
        <header className="space-y-1">
          <h2 className="text-2xl font-bold">Get your own business card</h2>

          <p className="text-muted-foreground">
            Improve your personal brand and make it stand out from the crowd.
          </p>
        </header>

        <section className="flex flex-col gap-2">
          <h3 className="text-lg font-medium">Card design</h3>

          <FormField
            name="cardVariant"
            control={form.control}
            render={({ field }) => (
              <RadioGroupRadix
                className="flex gap-4"
                value={field.value}
                onValueChange={field.onChange}
              >
                <DefaultCard />
                <CustomCard />
                <MetallicCard />
              </RadioGroupRadix>
            )}
          />

          <article
            className={cn(
              "relative col-span-2 mt-2 flex h-[240px] flex-col justify-center gap-2 transition-all",
              cardVariant !== "custom" && "pointer-events-none mt-0 h-0 opacity-0",
            )}
          >
            <Label className="flex items-center gap-2">
              <ResetIcon className="rotate-180" />
              Front card design
            </Label>

            {!!imageFront && (
              <div className="absolute z-0 h-56 w-full max-w-max overflow-hidden rounded-lg">
                <Image
                  quality={50}
                  placeholder="blur"
                  blurDataURL={`data:image/png;base64,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dGU6Y3JlYXRlADIwMjQtMDgtMTVUMTc6NTA6NDMrMDA6MDCA6qEpAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDI0LTA4LTE1VDE3OjUwOjQzKzAwOjAw8bcZlQAAABd0RVh0ZXhpZjpZQ2JDclBvc2l0aW9uaW5nADGsD4BjAAAAFnRFWHR0aWZmOlhSZXNvbHV0aW9uADMwMC8xfdCquAAAABZ0RVh0dGlmZjpZUmVzb2x1dGlvbgAzMDAvMfp2YfsAAAAkdEVYdHhtcDpDcmVhdG9yVG9vbABBZG9iZSBTdG9jayBQbGF0Zm9ybTZ+QnEAAAA9dEVYdHhtcE1NOkRvY3VtZW50SUQAeG1wLmlpZDo2YzJhMzI3ZC0wZWQzLTQ1YjAtOGU1Ni1kNDE2ZDU1ZjMwOWUTj4qbAAAAR3RFWHR4bXBNTTpJbnN0YW5jZUlEAGFkb2JlOmRvY2lkOnN0b2NrOjZlYzc2YzFkLTgxMzItNDE2MS05NzkwLTRiYmZlZDAxNGIwMGDVS+kAAAA0dEVYdHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRABhZG9iZTpkb2NpZDpzdG9jazo1OTc0NzQ3OTFHsXJmAAAAAElFTkSuQmCC`}
                  alt={`custom-card-front`}
                  src={imageFront}
                  width={350}
                  height={200}
                />
              </div>
            )}

            <UploadDropzone
              endpoint="cardDesigns"
              className={cn(
                "z-10 h-full w-[350px] space-y-2 bg-transparent p-4 transition-all ut-button:h-9 ut-button:w-max ut-button:rounded-md ut-button:px-4 ut-button:text-sm ut-allowed-content:hidden ut-label:font-medium ut-label:text-foreground",
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
                    Upload a design (1050x600 pixels for the best results)
                  </span>
                ),
                uploadIcon: () => <></>,
              }}
            />

            <Button onClick={() => form.setValue("cardImageFront", undefined)}>
              Remove design
            </Button>
          </article>

          <article
            className={cn(
              "relative col-span-2 mt-2 flex h-[240px] flex-col justify-center gap-2 transition-all",
              cardVariant !== "custom" && "pointer-events-none mt-0 h-0 opacity-0",
            )}
          >
            <div>
              <Label className="flex items-center gap-2">
                <ResetIcon />
                Back card design
              </Label>

              {!!imageBack && (
                <div className="absolute z-0 h-56 w-full overflow-hidden rounded-lg">
                  <Image
                    quality={50}
                    className="object-cover"
                    placeholder="blur"
                    blurDataURL={`data:image/png;base64,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dGU6Y3JlYXRlADIwMjQtMDgtMTVUMTc6NTA6NDMrMDA6MDCA6qEpAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDI0LTA4LTE1VDE3OjUwOjQzKzAwOjAw8bcZlQAAABd0RVh0ZXhpZjpZQ2JDclBvc2l0aW9uaW5nADGsD4BjAAAAFnRFWHR0aWZmOlhSZXNvbHV0aW9uADMwMC8xfdCquAAAABZ0RVh0dGlmZjpZUmVzb2x1dGlvbgAzMDAvMfp2YfsAAAAkdEVYdHhtcDpDcmVhdG9yVG9vbABBZG9iZSBTdG9jayBQbGF0Zm9ybTZ+QnEAAAA9dEVYdHhtcE1NOkRvY3VtZW50SUQAeG1wLmlpZDo2YzJhMzI3ZC0wZWQzLTQ1YjAtOGU1Ni1kNDE2ZDU1ZjMwOWUTj4qbAAAAR3RFWHR4bXBNTTpJbnN0YW5jZUlEAGFkb2JlOmRvY2lkOnN0b2NrOjZlYzc2YzFkLTgxMzItNDE2MS05NzkwLTRiYmZlZDAxNGIwMGDVS+kAAAA0dEVYdHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRABhZG9iZTpkb2NpZDpzdG9jazo1OTc0NzQ3OTFHsXJmAAAAAElFTkSuQmCC`}
                    alt={`custom-card-back`}
                    src={imageBack}
                    width={350}
                    height={200}
                  />
                </div>
              )}

              <UploadDropzone
                endpoint="cardDesigns"
                className={cn(
                  "z-10 mt-0 h-full w-[350px] space-y-2 bg-transparent p-4 transition-all ut-button:h-9 ut-button:w-max ut-button:rounded-md ut-button:px-4 ut-button:text-sm ut-allowed-content:hidden ut-label:font-medium ut-label:text-foreground",
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
                      Upload a design (1050x600 pixels for the best results)
                    </span>
                  ),
                  uploadIcon: () => <></>,
                }}
              />
            </div>

            <Button onClick={() => form.setValue("cardImageBack", undefined)}>Remove design</Button>
          </article>
        </section>

        <section className="flex w-full flex-col gap-4">
          <div className="space-y-1">
            <h3 className="text-lg font-medium">What should it have? </h3>

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
                "flex flex-col gap-2 transition-all",
                !hasCompanyLogo && "pointer-events-none h-0 opacity-0",
              )}
            >
              <section
                className={cn(
                  "relative flex h-[200px] flex-col justify-center gap-2 bg-contain bg-center bg-no-repeat",
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
                        Upload a company logo (optional)
                      </span>
                    ),
                    uploadIcon: () => <></>,
                  }}
                />
              </section>

              <Button
                className="max-w-max"
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
      <h4>Basic NFC card</h4>
    </RadioGroupItemRadix>
  );
};

const CustomCard = () => {
  return (
    <RadioGroupItemRadix
      className="h-28 w-52 rounded-lg border bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4 shadow-md transition-all data-[state=checked]:ring data-[state=checked]:ring-ring data-[state=checked]:ring-offset-1"
      value="custom"
    >
      <h4 className="bg-clip-text font-medium text-white">Customizable card</h4>
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
