"use client";

import { SignUpButton, useAuth } from "@clerk/nextjs";
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowRightIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";

export const DecideSession = () => {
  const auth = useAuth();
  const t = useTranslations("landing");

  if (auth.isSignedIn) {
    return (
      <Button asChild className="rounded-full">
        <Link href="/admin">
          {t("navbar.dashboard")} <ChevronRightIcon />
        </Link>
      </Button>
    );
  }

  return (
    <SignUpButton>
      <Button className="rounded-full">
        {t("navbar.joinNow")} <ArrowRightIcon />
      </Button>
    </SignUpButton>
  );
};
