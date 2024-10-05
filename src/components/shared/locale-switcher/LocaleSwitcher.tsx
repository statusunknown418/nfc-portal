"use client";

import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { type Locale } from "~/i18n/config";

export const LocaleSwitcher = ({
  initial,
  setSpanish,
  setEnglish,
}: {
  initial: Locale;
  setSpanish: () => void;
  setEnglish: () => void;
}) => {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          {initial === "en" ? "🇺🇸" : "🇪🇸"}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuItem
          onSelect={() => {
            setEnglish();
            router.refresh();
          }}
        >
          🇺🇸 English
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => {
            setSpanish();
            router.refresh();
          }}
        >
          🇪🇸 Español
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
