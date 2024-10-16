"use client";

import { useAuth } from "@clerk/nextjs";
import { ArrowRightIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "../ui/button";

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
    <Button className="rounded-full">
      <Link href="/onboarding/start">
        {t("navbar.joinNow")} <ArrowRightIcon />
      </Link>
    </Button>
  );
};
