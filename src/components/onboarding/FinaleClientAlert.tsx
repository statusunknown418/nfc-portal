"use client";

import { TrackNextIcon } from "@radix-ui/react-icons";
import confetti from "canvas-confetti";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { api } from "~/trpc/react";
import { ShareLink } from "../admin/ShareLink";
import Confetti, { type ConfettiRef } from "../magicui/confetti";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

export const FinaleClientAlert = () => {
  const [data, { isLoading }] = api.viewer.shouldShowLive.useSuspenseQuery();
  const t = useTranslations("admin.onboarding.steps.finale");
  const confettiRef = useRef<ConfettiRef>(null);

  useEffect(() => {
    confettiRef?.current?.fire({});
  }, []);

  const handleClick = () => {
    const end = Date.now() + 3 * 1000; // 3 seconds
    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

    const frame = async () => {
      if (Date.now() > end) return;

      await Promise.all([
        confetti({
          particleCount: 100,
          angle: 60,
          spread: 55,
          startVelocity: 60,
          origin: { x: 0, y: 0.5 },
          colors: colors,
        }),
        confetti({
          particleCount: 100,
          angle: 120,
          spread: 55,
          startVelocity: 60,
          origin: { x: 1, y: 0.5 },
          colors: colors,
        }),
      ]);

      requestAnimationFrame(() => void frame());
    };

    void frame();
  };

  const RenderAlert = () => {
    if (!!data?.hasPurchasedCard) {
      return (
        <Alert variant="indigo" className="z-10 mt-4 max-w-lg">
          <AlertTitle>{t("banners.sharePortal.title")}</AlertTitle>

          <AlertDescription className="mb-4">
            {t("banners.sharePortal.description")}
          </AlertDescription>

          {data?.username && <ShareLink username={data.username} pageHashKey={data.pageHashKey!} />}
        </Alert>
      );
    }

    return (
      <Alert variant="warning" className="z-10 mt-4 max-w-lg">
        <AlertTitle>{t("banners.warning.title")}</AlertTitle>

        <AlertDescription className="mb-4">{t("banners.warning.description")}</AlertDescription>
      </Alert>
    );
  };

  return (
    <>
      {isLoading ? <Skeleton className="h-32 w-96" /> : <RenderAlert />}

      <Button onClick={handleClick} className="z-10 mt-4" size="sm" variant="link">
        ✨ Click me for fun
      </Button>

      <Confetti ref={confettiRef} className="absolute left-0 top-0 z-0 size-full" />

      {data?.hasPurchasedCard ? (
        <Button size="lg" variant="primary_ghost" className="z-10">
          Complete onboarding
        </Button>
      ) : (
        <div className="z-10 mt-4 flex gap-2">
          <Button asChild>
            <Link href="/onboarding/purchase">Go back</Link>
          </Button>

          <Button variant="ghost" asChild>
            <Link href="/admin">
              Skip to dashboard
              <TrackNextIcon />
            </Link>
          </Button>
        </div>
      )}
    </>
  );
};
