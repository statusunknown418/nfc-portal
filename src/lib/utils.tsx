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
} from "@phosphor-icons/react/dist/ssr";
import { type ClassValue, clsx } from "clsx";
import { type ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { type IconProps, Icons } from "~/components/ui/icons";
import { type CardTemplatesType } from "~/server/api/schemas.zod";
import { type CardShippingStatus, type SocialLinkType, type ThemeType } from "~/server/db/schema";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function arrayMoveMutable<T extends unknown[]>(
  array: T,
  fromIndex: number,
  toIndex: number,
) {
  const startIndex = fromIndex < 0 ? array.length + fromIndex : fromIndex;

  if (startIndex >= 0 && startIndex < array.length) {
    const endIndex = toIndex < 0 ? array.length + toIndex : toIndex;

    const [item] = array.splice(fromIndex, 1);
    array.splice(endIndex, 0, item);
  }
}

export function arrayMove<T extends unknown[]>(array: T, fromIndex: number, toIndex: number) {
  const newArray = [...array];
  arrayMoveMutable(newArray, fromIndex, toIndex);
  return newArray;
}

export const newShade = (hexColor: string, magnitude: number) => {
  hexColor = hexColor.replace(`#`, ``);
  if (hexColor.length === 6) {
    const decimalColor = parseInt(hexColor, 16);
    let r = (decimalColor >> 16) + magnitude;
    r > 255 && (r = 255);
    r < 0 && (r = 0);
    let g = (decimalColor & 0x0000ff) + magnitude;
    g > 255 && (g = 255);
    g < 0 && (g = 0);
    let b = ((decimalColor >> 8) & 0x00ff) + magnitude;
    b > 255 && (b = 255);
    b < 0 && (b = 0);
    return `#${(g | (b << 8) | (r << 16)).toString(16)}`;
  } else {
    return hexColor;
  }
};

export const preventBackdropClick = (e: React.MouseEvent<HTMLElement>) => {
  e.nativeEvent.stopImmediatePropagation();
  e.nativeEvent.preventDefault();
  e.stopPropagation();
};

export enum ThemeKeys {
  base = "base",
  dark = "dark",
  minimal = "minimal",
  crazy = "crazy",
  blurry = "blurry",
  stripes = "stripes",
  modern = "modern",
}

export const BASE_THEMES: Record<ThemeKeys, ThemeType> = {
  base: {
    themeKey: "custom",
    colorScheme: "light",
    colors: {
      foreground: "#000000",
      background: "#f8f8fc",
      border: "#000000",
      subtle: "#000000",
    },
    buttons: {
      fontStyle: "normal",
      fontWeight: "bold",
      variant: "pill",
      textColor: "#000000",
      background: "#a5b4fc",
      borderColor: "#000000",
      borderStyle: "solid",
      rounding: "9999px",
    },
  },
  dark: {
    themeKey: "dark",
    colorScheme: "dark",
    colors: {
      background: "#000000",
      foreground: "#ffffff",
      border: "#ffffff",
      subtle: "#ffffff",
    },
    buttons: {
      fontStyle: "normal",
      fontWeight: "bold",
      variant: "pill",
      textColor: "#ffffff",
      background: "#4f46e5",
      borderColor: "#000000",
      borderStyle: "solid",
      rounding: "9999px",
    },
  },
  minimal: {
    themeKey: "minimal",
    colorScheme: "light",
    colors: {
      background: "#f8f8fc",
      foreground: "#000000",
      border: "#000000",
      subtle: "#000000",
    },
    buttons: {
      fontStyle: "normal",
      fontWeight: "bold",
      variant: "pill",
      textColor: "#f8f8fc",
      background: "#4f46e5",
      borderColor: "#000000",
      borderStyle: "solid",
      rounding: "9999px",
    },
  },
  crazy: {
    themeKey: "crazy",
    colorScheme: "light",

    colors: {
      background: "#f8f8fc",
      foreground: "#000000",
      border: "#000000",
      subtle: "#000000",
    },
    buttons: {
      fontStyle: "normal",
      fontWeight: "bold",
      variant: "pill",
      textColor: "#f8f8fc",
      background: "#4f46e5",
      borderColor: "#000000",
      borderStyle: "solid",
      rounding: "9999px",
    },
  },
  blurry: {
    themeKey: "blurry",
    colorScheme: "light",
    colors: {
      background: "linear-gradient(to top left,#accbee,#e7f0fd)",
      foreground: "#000000",
      border: "#000000",
      subtle: "#e7f0fd",
    },
    buttons: {
      fontStyle: "normal",
      fontWeight: "bold",
      variant: "pill",
      textColor: "#f8f8fc",
      background: "#4f46e5",
      borderColor: "#000000",
      borderStyle: "solid",
      rounding: "9999px",
    },
  },
  stripes: {
    themeKey: "stripes",
    colorScheme: "light",
    colors: {
      background: "linear-gradient(to top left,#d5d4d0,#d5d4d0,#eeeeec)",
      foreground: "#000000",
      border: "#000000",
      subtle: "#000000",
    },
    buttons: {
      fontStyle: "normal",
      fontWeight: "bold",
      variant: "pill",
      textColor: "#f8f8fc",
      background: "#4f46e5",
      borderColor: "#000000",
      borderStyle: "solid",
      rounding: "9999px",
    },
  },
  modern: {
    themeKey: "modern",
    colorScheme: "light",
    colors: {
      foreground: "#000000",
      background: "#f8f8fc",
      border: "#000000",
      subtle: "#000000",
    },
    buttons: {
      fontStyle: "normal",
      fontWeight: "bold",
      variant: "pill",
      textColor: "#f8f8fc",
      background: "#4f46e5",
      borderColor: "#000000",
      borderStyle: "solid",
      rounding: "9999px",
    },
  },
};

export const purchaseStatusToText = (status: CardShippingStatus) => {
  switch (status) {
    case "awaiting_purchase":
      return "Not purchased yet";
    case "in_progress":
      return "Your card is being shipped! Sit tight...";
    case "shipped":
      return "You will receive your card shortly!";
    case "failed":
      return "Something went wrong during the shipping process. Please contact us directly";
    default:
      return "Unknown status";
  }
};

export const imageURLToBase64 = async (url: string) => {
  const data = await fetch(url);
  return await data.blob();
};

export const basicCardTemplates = [
  {
    value: "simple-logos",
    front: "/basic-templates/simple-logos.png",
    back: "/basic-templates/simple-logos-back.png",
  },
  {
    value: "edge-to-edge",
    front: "https://picsum.photos/id/6/350/200",
    back: "https://picsum.photos/id/7/350/200",
  },
  {
    value: "minimal-logos",
    front: "https://picsum.photos/id/20/350/200",
    back: "https://picsum.photos/id/21/350/200",
  },
] as {
  value: CardTemplatesType;
  front: string;
  back: string;
}[];

export const PORTAL_KEY = "portal-password";
export const PORTAL_QUERY = "ktp";
export const INCOMING_URL = "x-current-url";
export const LOCALE_KEY = "NEXT_LOCALE";

export const OutlinedSocialIcons = (props: IconProps & { type: SocialLinkType }) => {
  const { type, ...rest } = props;

  switch (type) {
    case "twitter":
      return <TwitterLogo {...rest} />;
    case "linkedin":
      return <LinkedinLogo {...rest} />;
    case "facebook":
      return <FacebookLogo {...rest} />;
    case "instagram":
      return <InstagramLogo {...rest} />;
    case "github":
      return <GithubLogo {...rest} />;
    case "tiktok":
      return <TiktokLogo {...rest} />;
    case "youtube":
      return <YoutubeLogo {...rest} />;
    case "telegram":
      return <TelegramLogo {...rest} />;
    case "patreon":
      return <PatreonLogo {...rest} />;
    case "spotify":
      return <SpotifyLogo {...rest} />;
    default:
      return <TwitterLogo {...rest} />;
  }
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
