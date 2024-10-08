"use client";

import { ChevronDownIcon } from "@radix-ui/react-icons";
import { usePathname } from "next/navigation";
import { redirect, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { type Locale } from "~/i18n/config";
import { changeViewerLocale } from "~/lib/cookies.actions";

export const LocaleSwitcher = ({ initial }: { initial: Locale }) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = async (locale: Locale) => {
    await changeViewerLocale(locale);
    router.refresh();
    redirect(pathname);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          {initial === "en" ? "🇺🇸 English" : "🇪🇸 Español"}
          <ChevronDownIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start">
        <DropdownMenuLabel>Language</DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={() => toast.promise(handleChange("en"), { loading: "Updating..." })}
        >
          🇺🇸 English
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => toast.promise(handleChange("es"), { loading: "Updating..." })}
        >
          🇪🇸 Español
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
