"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  FacebookLogo,
  GithubLogo,
  InstagramLogo,
  LinkedinLogo,
  PatreonLogo,
  SpotifyLogo,
  TelegramLogo,
  TiktokLogo,
  TwitterLogo,
  YoutubeLogo,
} from "@phosphor-icons/react";
import { GlobeIcon } from "@radix-ui/react-icons";
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
import { Icons, type IconProps } from "~/components/ui/icons";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import { newLinkSchema, type NewLinkSchema, type SocialLinkType } from "~/server/db/schema";
import { api } from "~/trpc/react";

export const OutlinedSocialIcons: Record<SocialLinkType, (props: IconProps) => ReactNode> = {
  twitter: TwitterLogo,
  linkedin: LinkedinLogo,
  facebook: FacebookLogo,
  instagram: InstagramLogo,
  github: GithubLogo,
  tiktok: TiktokLogo,
  youtube: YoutubeLogo,
  telegram: TelegramLogo,
  patreon: PatreonLogo,
  spotify: SpotifyLogo,
};

export const SocialIcons: Record<SocialLinkType, (props: IconProps) => ReactNode> = {
  twitter: Icons.twitter,
  linkedin: Icons.linkedin,
  facebook: Icons.facebook,
  instagram: Icons.instagram,
  github: Icons.gitHub,
  tiktok: Icons.tikTok,
  youtube: Icons.youtube,
  telegram: Icons.telegram,
  patreon: Icons.patreon,
  spotify: Icons.spotify,
};

const socialLinks: Array<{
  name: string;
  icon: ReactNode;
  key: SocialLinkType;
  url: (username: string) => string;
}> = [
  {
    name: "Twitter",
    icon: <SocialIcons.twitter className="size-10" />,
    key: "twitter",
    url: (username: string) => `https://x.com/${username}`,
  },
  {
    name: "LinkedIn",
    icon: <SocialIcons.linkedin className="size-10" />,
    key: "linkedin",
    url: (username: string) => `https://linkedin.com/in/${username}`,
  },
  {
    name: "Facebook",
    icon: <SocialIcons.facebook className="size-10" />,
    key: "facebook",
    url: (username: string) => `https://facebook.com/${username}`,
  },
  {
    name: "Instagram",
    icon: <SocialIcons.instagram className="size-10" />,
    key: "instagram",
    url: (username: string) => `https://instagram.com/${username}`,
  },
  {
    name: "Github",
    icon: <SocialIcons.github className="size-10" />,
    key: "github",
    url: (username: string) => `https://github.com/${username}`,
  },
  {
    name: "TikTok",
    icon: <SocialIcons.tiktok className="size-10" />,
    key: "tiktok",
    url: (username: string) => `https://tiktok.com/${username}`,
  },
  {
    name: "Youtube",
    icon: <SocialIcons.youtube className="size-10" />,
    key: "youtube",
    url: (username: string) => `https://youtube.com/${username}`,
  },
  {
    name: "Telegram",
    icon: <SocialIcons.telegram className="size-10" />,
    key: "telegram",
    url: (username: string) => `https://t.me/${username}`,
  },
  {
    name: "Patreon",
    icon: <SocialIcons.patreon className="size-10" />,
    key: "patreon",
    url: (username: string) => `https://patreon.com/${username}`,
  },
  {
    name: "Spotify",
    icon: <SocialIcons.spotify className="size-10" />,
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
              <FormItem className="col-span-3 mt-4">
                <FormLabel>Username or handle</FormLabel>

                <div className="flex h-11 items-center">
                  <p className="flex h-full items-center rounded-l-lg border border-r-0 bg-muted px-4 text-sm text-muted-foreground">
                    {socialLinks.find((link) => link.key === selectedPredefined)?.url("")}
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
