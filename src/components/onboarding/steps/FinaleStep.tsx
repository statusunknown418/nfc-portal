import { ArrowRightIcon, CheckCircledIcon } from "@radix-ui/react-icons";
import confetti from "canvas-confetti";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { ShareLink } from "~/components/admin/ShareLink";
import Confetti, { type ConfettiRef } from "~/components/magicui/confetti";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { api, type RouterOutputs } from "~/trpc/react";

export const FinaleStep = ({
  initialData,
}: {
  initialData: RouterOutputs["viewer"]["shouldShowLive"];
}) => {
  const confettiRef = useRef<ConfettiRef>(null);
  const t = useTranslations("admin.onboarding.steps.finale");
  const common = useTranslations("common");

  const { mutate } = api.viewer.setOnboardingStep.useMutation();
  const { data, isLoading } = api.viewer.shouldShowLive.useQuery();

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

          {initialData?.username && (
            <ShareLink username={initialData.username} pageHashKey={initialData.pageHashKey!} />
          )}
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
    <section className="relative mx-auto flex min-h-[calc(100svh-20rem)] flex-col items-center justify-center gap-4">
      <CheckCircledIcon className="h-12 w-12 text-emerald-600 md:h-12 md:w-12" />

      <h2 className="text-2xl font-bold tracking-wide md:text-4xl">{t("title")}</h2>

      <p className="max-w-prose text-center">
        <span>{t("descriptionPart1")}</span>{" "}
        <span className="text-muted-foreground">{t("descriptionPart2")}</span>
      </p>

      {isLoading ? <Skeleton className="h-32 w-96" /> : <RenderAlert />}

      <Button onClick={handleClick} className="z-10 mt-4" size="sm" variant="link">
        ✨ Click me for fun
      </Button>

      <Button
        size="lg"
        variant="primary"
        className="z-10 rounded-full"
        onClick={() => mutate({ forceCompleted: true })}
        asChild
      >
        <Link href="/admin">
          {common("redirection.admin")}

          <ArrowRightIcon />
        </Link>
      </Button>

      <Button className="z-10" size="sm" variant="link" asChild>
        <Link href="mailto:support@stackkstudios.com">{common("askHelp")}</Link>
      </Button>

      <Confetti
        ref={confettiRef}
        className="absolute left-0 top-0 z-0 size-full"
        onMouseEnter={() => confettiRef.current?.fire({})}
      />
    </section>
  );
};
