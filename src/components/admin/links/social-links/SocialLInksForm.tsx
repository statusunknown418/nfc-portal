"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  SiFacebook,
  SiPatreon,
  SiSpotify,
  SiTelegram,
  SiTiktok,
  SiYoutube,
} from "@icons-pack/react-simple-icons";
import { GlobeIcon, InstagramLogoIcon, LinkedInLogoIcon } from "@radix-ui/react-icons";
import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group";
import { type ReactNode, useState } from "react";
import { useForm } from "react-hook-form";
import { Spinner } from "~/components/shared/Spinner";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Icons } from "~/components/ui/icons";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import { newLinkSchema, type NewLinkSchema, type SocialLinkType } from "~/server/db/schema";
import { api } from "~/trpc/react";

const socialLinks: Array<{
  name: string;
  icon: ReactNode;
  key: SocialLinkType;
  url: (username: string) => string;
}> = [
  {
    name: "Twitter",
    icon: <Icons.twitter className="size-8" />,
    key: "twitter",
    url: (username: string) => `https://x.com/${username}`,
  },
  {
    name: "LinkedIn",
    icon: <LinkedInLogoIcon className="size-8" />,
    key: "linkedin",
    url: (username: string) => `https://linkedin.com/in/${username}`,
  },
  {
    name: "Facebook",
    icon: <SiFacebook className="size-8" />,
    key: "facebook",
    url: (username: string) => `https://facebook.com/${username}`,
  },
  {
    name: "Instagram",
    icon: <InstagramLogoIcon className="size-8" />,
    key: "instagram",
    url: (username: string) => `https://instagram.com/${username}`,
  },
  {
    name: "Github",
    icon: <Icons.gitHub className="size-8" />,
    key: "github",
    url: (username: string) => `https://github.com/${username}`,
  },
  {
    name: "TikTok",
    icon: <SiTiktok className="size-8" />,
    key: "tiktok",
    url: (username: string) => `https://tiktok.com/${username}`,
  },
  {
    name: "Youtube",
    icon: <SiYoutube className="size-8" />,
    key: "youtube",
    url: (username: string) => `https://youtube.com/${username}`,
  },
  {
    name: "Telegram",
    icon: <SiTelegram className="size-8" />,
    key: "telegram",
    url: (username: string) => `https://t.me/${username}`,
  },
  {
    name: "Patreon",
    icon: <SiPatreon className="size-8" />,
    key: "patreon",
    url: (username: string) => `https://patreon.com/${username}`,
  },
  {
    name: "Spotify",
    icon: <SiSpotify className="size-8" />,
    key: "spotify",
    url: (username: string) => `https://open.spotify.com/artist/${username}`,
  },
];

export const SocialLInksForm = ({
  username,
  onClose,
}: {
  username: string;
  onClose?: () => void;
}) => {
  const [selectedPredefined, setSelectedPredefined] = useState<SocialLinkType | null>(null);

  const form = useForm<NewLinkSchema>({
    resolver: zodResolver(newLinkSchema.refine((data) => data.displayText !== "")),
  });

  const utils = api.useUtils();

  const addLink = api.links.new.useMutation({
    onSuccess: async () => {
      form.reset();

      await Promise.all([
        utils.links.all.invalidate(),
        utils.viewer.previewPortal.invalidate(),
        utils.portals.get.invalidate({ username: username }),
      ]);

      onClose?.();
    },
  });

  const onSubmit = (data: NewLinkSchema) => {
    const buildUrl = socialLinks
      .find((link) => link.key === data.socialType)
      ?.url(data.displayText ?? "");

    addLink.mutate({
      ...data,
      url: buildUrl,
    });
  };

  return (
    <Form {...form}>
      <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="socialType"
          render={({ field }) => (
            <RadioGroup
              className="grid grid-cols-4 gap-4 *:size-full"
              value={field.value ?? undefined}
              onValueChange={field.onChange}
            >
              {socialLinks.map((link) => (
                <RadioGroupItem asChild value={link.key} key={link.key}>
                  <Button
                    type="button"
                    variant="unstyled"
                    className={cn(
                      "h-auto min-h-20 flex-col items-center rounded-lg border-border p-4 ring-offset-1 transition-all active:ring active:ring-ring",
                      selectedPredefined === link.key &&
                        "border-indigo-600 bg-indigo-50 ring ring-ring",
                    )}
                    onClick={() => setSelectedPredefined(link.key)}
                  >
                    {link.icon}

                    <p>{link.name}</p>
                  </Button>
                </RadioGroupItem>
              ))}
            </RadioGroup>
          )}
        />

        {selectedPredefined && (
          <FormField
            control={form.control}
            name="displayText"
            render={({ field }) => (
              <FormItem className="col-span-3">
                <FormLabel>Username or handle</FormLabel>

                <div className="flex h-11 items-center">
                  <p className="flex h-full items-center rounded-l-lg border border-r-0 bg-muted px-4 text-sm text-muted-foreground">
                    https://{selectedPredefined}.com/{selectedPredefined === "linkedin" ? "in" : ""}
                  </p>

                  <Input
                    {...field}
                    value={field.value ?? ""}
                    className="h-11 rounded-l-none"
                    placeholder={`@someone`}
                  />
                </div>

                <FormDescription>Add a valid url for this social platform</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button variant="primary" size="lg" type="submit">
          {addLink.isPending ? <Spinner className="text-primary-foreground" /> : <GlobeIcon />}
          Save
        </Button>
      </form>
    </Form>
  );
};
