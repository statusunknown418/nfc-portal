import { ClerkLoading, SignUpButton } from "@clerk/nextjs";
import {
  ArrowDownIcon,
  ArrowRightIcon,
  ChevronRightIcon,
  InfoCircledIcon,
  LightningBoltIcon,
  LockClosedIcon,
  MagicWandIcon,
  OpenInNewWindowIcon,
  QuestionMarkCircledIcon,
  Share1Icon,
} from "@radix-ui/react-icons";
import { useMessages, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import AnimatedGridPattern from "~/components/magicui/animated-grid-pattern";
import BlurFade from "~/components/magicui/blur-fade";
import { BorderBeam } from "~/components/magicui/border-beam";
import HyperText from "~/components/magicui/hyper-text";
import Marquee from "~/components/magicui/marquee";
import { DecideSession } from "~/components/shared/DecideSession";
import { LocaleSwitcherWrapper } from "~/components/shared/locale-switcher";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";
import { cn } from "~/lib/utils";

export const dynamic = "force-static";

export default function Home() {
  const t = useTranslations("landing");
  const messages = useMessages() as IntlMessages;
  const reviews = Object.values(
    messages.landing.testimonials.clients as Record<
      string,
      { name: string; username: string; body: string; img: string }
    >,
  );

  const firstRow = reviews.slice(0, reviews.length / 2);
  const secondRow = reviews.slice(reviews.length / 2);

  return (
    <main className="relative flex flex-col items-stretch gap-10">
      <div className="sticky inset-0 z-30 flex h-16 w-full items-end justify-center px-2">
        <header className="flex h-12 w-full max-w-7xl scroll-mt-2 items-center justify-between rounded-full border border-border/50 bg-white px-2 py-2 backdrop-blur-lg backdrop-filter">
          <Link href={"/"} className="flex items-center gap-2 font-medium">
            <Image
              src="/logo-light.png"
              alt="concard-logo"
              width={32}
              height={32}
              className="rounded-lg"
            />
            ConCard
          </Link>

          <ul className="hidden md:flex">
            <Button asChild variant="ghost">
              <Link href={"/#features"}>{t("navbar.features")}</Link>
            </Button>

            <Button asChild variant="ghost">
              <Link href={"/#customers"}>{t("navbar.customers")}</Link>
            </Button>

            <Button asChild variant="ghost">
              <Link href={"#pricing"}>{t("navbar.pricing")}</Link>
            </Button>

            <Suspense>
              <LocaleSwitcherWrapper />
            </Suspense>
          </ul>

          <div className="flex w-28 max-w-28 justify-end">
            <ClerkLoading>
              <Skeleton className="h-9 w-24 rounded-full" />
            </ClerkLoading>

            <DecideSession />
          </div>
        </header>
      </div>

      <AnimatedGridPattern
        duration={2}
        repeatDelay={0.5}
        numSquares={50}
        className={cn(
          "[mask-image:radial-gradient(800px_circle_at_center,white,transparent)]",
          "absolute inset-0 -z-10 h-svh w-svw fill-indigo-500 opacity-30",
        )}
      />

      <div
        id="hero"
        className="relative flex min-h-[calc(100svh-10rem)] flex-col items-center justify-center gap-16"
      >
        <section className="relative mx-auto w-full max-w-7xl px-5 md:px-10">
          <article className="flex flex-col items-center gap-7">
            <BlurFade delay={0.25 * 2}>
              <Badge>
                ✨ {t("hero.banner")} <ArrowRightIcon />
              </Badge>
            </BlurFade>

            <BlurFade>
              <h1 className="text-center text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
                {t("hero.heading")}
                {/* <span className="bg-gradient-to-r from-indigo-700 via-violet-500 to-purple-400 bg-clip-text text-transparent">
                    NFC
                  </span>{" "} */}
              </h1>
            </BlurFade>

            <BlurFade delay={0.25}>
              <p className="max-w-sm text-pretty text-center text-muted-foreground sm:text-lg md:max-w-lg md:text-xl lg:max-w-4xl">
                {t("hero.description")}
              </p>
            </BlurFade>

            <BlurFade delay={0.25}>
              <div className="flex flex-col items-center justify-center gap-2 md:flex-row">
                <SignUpButton>
                  <Button
                    asChild
                    variant="primary"
                    size="lg"
                    className="group w-full shadow-lg shadow-indigo-300 transition-all hover:shadow-xl hover:shadow-indigo-300 sm:w-auto"
                  >
                    <Link href="/admin">
                      {t("hero.startNow")}
                      <ChevronRightIcon className="transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </SignUpButton>

                <Button asChild variant="ghost" size="lg" className="group">
                  <Link href="#features">
                    {t("hero.why")}
                    <QuestionMarkCircledIcon className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </BlurFade>
          </article>
        </section>

        <article className="w-full max-w-7xl px-4">
          <BlurFade delay={0.25 * 2}>
            <div className="flex aspect-video w-full items-center justify-center rounded-2xl border border-border/50 bg-white shadow-lg shadow-[hsl(240_37%_90%)]">
              Video or card animation
            </div>
          </BlurFade>
        </article>

        <Button variant="ghost">
          <ArrowDownIcon />
          {t("hero.learnMore")}
        </Button>
      </div>

      <section className="bg-white py-24" id="customers">
        <article className="relative mx-auto max-w-7xl">
          <h3 className="text-center text-lg font-medium uppercase text-muted-foreground">
            {t("testimonials.heading")}
          </h3>

          <Marquee pauseOnHover className="mt-5 [--duration:30s]">
            {firstRow.map((review) => (
              <ReviewCard key={review.username} {...review} />
            ))}
          </Marquee>

          <Marquee reverse pauseOnHover className="[--duration:30s]">
            {secondRow.map((review) => (
              <ReviewCard key={review.username} {...review} />
            ))}
          </Marquee>

          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-white dark:from-background" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-white dark:from-background" />

          <p className="mt-4 text-center text-xs text-muted-foreground">
            {t("testimonials.privacyDisclaimer")}
          </p>
        </article>
      </section>

      <div className="-mt-10 flex min-h-screen items-center rounded-t-[24px] bg-gradient-to-br from-neutral-950 via-neutral-800 to-neutral-950 p-4 py-20 text-neutral-200">
        <section
          id="how-it-works"
          className="mx-auto flex w-full max-w-7xl flex-col gap-10 md:gap-14"
        >
          <header className="space-y-2 px-4 md:px-6">
            <p className="font-medium text-emerald-400">{t("stepByStep.title")}</p>
            <h2 className="text-4xl font-semibold tracking-tight">{t("stepByStep.subtitle")}</h2>
            <p className="text-lg text-muted-foreground">{t("stepByStep.subheading")}</p>
          </header>

          <div className="grid grid-cols-1 *:space-y-3 *:border-b *:border-border/20 *:px-4 *:py-6 md:grid-cols-2 md:justify-items-stretch md:gap-0 md:*:space-y-5 md:*:border-r md:*:px-8 md:*:py-10">
            <article className="border-b">
              <Badge variant="secondary">1</Badge>

              <section>
                <h3 className="text-lg font-medium">{t("stepByStep.stepOneTitle")}</h3>
                <p className="text-muted-foreground">{t("stepByStep.stepOneDescription")}</p>
              </section>

              <div className="flex h-52 w-full items-center justify-center bg-neutral-700">
                add graphic
              </div>
            </article>

            <article className="!border-r-0 border-b">
              <Badge variant="secondary">2</Badge>

              <section>
                <h3 className="text-lg font-medium">{t("stepByStep.stepTwoTitle")}</h3>
                <p className="text-muted-foreground">{t("stepByStep.stepTwoDescription")}</p>
              </section>

              <div className="flex h-52 w-full items-center justify-center bg-neutral-700">
                add graphic
              </div>
            </article>

            <article className="border-b">
              <Badge variant="secondary">3</Badge>

              <section>
                <h3 className="text-lg font-medium">{t("stepByStep.stepThreeTitle")}</h3>
                <p className="text-muted-foreground">{t("stepByStep.stepThreeDescription")}</p>
              </section>

              <div className="flex h-52 w-full items-center justify-center bg-neutral-700">
                add graphic
              </div>
            </article>

            <article className="!border-r-0 border-b">
              <Badge variant="secondary">4</Badge>

              <section>
                <h3 className="text-lg font-medium">{t("stepByStep.stepFourTitle")}</h3>
                <p className="text-muted-foreground">{t("stepByStep.stepFourDescription")}</p>
              </section>

              <div className="flex h-52 w-full items-center justify-center bg-neutral-700">
                add graphic
              </div>
            </article>

            <article className="border-none md:col-span-2">
              <Badge variant="secondary">5</Badge>

              <section>
                <h3 className="text-lg font-medium">{t("stepByStep.stepFiveTitle")}</h3>
                <p className="max-w-prose text-muted-foreground">
                  {t("stepByStep.stepFiveDescription")}
                </p>
              </section>

              <div className="flex h-52 w-full items-center justify-center bg-neutral-700">
                add graphic
              </div>
            </article>
          </div>
        </section>
      </div>

      <section
        id="features"
        className="flex items-center justify-center px-4 py-10 md:px-10 md:pb-20"
      >
        <article className="w-full max-w-7xl space-y-8 rounded-[32px]">
          <div className="space-y-2">
            <p className="font-semibold text-indigo-600">{t("features.subheading")}</p>

            <h2 className="text-4xl font-semibold tracking-tight">{t("features.heading")}</h2>

            <p className="max-w-prose text-lg text-muted-foreground">{t("features.description")}</p>
          </div>

          <section className="grid min-h-[800px] grid-cols-1 gap-4 *:flex *:flex-col *:gap-6 *:rounded-[24px] *:p-6 lg:grid-cols-12 lg:grid-rows-4">
            <article className="group border border-indigo-300 bg-indigo-100 text-indigo-900 lg:col-span-8 lg:row-span-2">
              <div>graphic 1</div>

              <h2 className="text-2xl font-medium">
                <span className="transition-all group-hover:text-indigo-400">
                  {t("features.firstGraphic")}
                </span>{" "}
                <span className="text-indigo-400 transition-all group-hover:text-inherit">
                  {t("features.secondGraphic")}
                </span>{" "}
                <span className="transition-all group-hover:text-indigo-400">
                  {t("features.thirdGraphic")}
                </span>
                <span className="text-indigo-400 transition-all group-hover:text-inherit">
                  {t("features.fourthGraphic")}
                </span>{" "}
                <span>{t("features.fifthGraphic")}</span>
              </h2>
            </article>

            <article className="border border-pink-300 bg-pink-100 text-pink-900 lg:col-span-4 lg:row-span-2">
              <section className="group relative flex h-48">
                <div className="absolute top-0 h-36 w-64 rounded-lg border bg-white transition-all md:right-5" />
                <div className="absolute top-4 h-36 w-64 rounded-lg border bg-gradient-to-r from-neutral-600 via-muted to-neutral-600 transition-all md:right-14" />
                <div className="absolute top-8 flex h-36 w-64 flex-col items-center justify-center gap-3 rounded-lg border bg-primary text-primary-foreground transition-all group-hover:scale-105 md:right-28">
                  <p className="flex items-center gap-2">
                    <Share1Icon className="h-5 w-5" /> Johannes Doe
                  </p>

                  <p className="text-sm text-muted-foreground">CEO at ACME</p>
                </div>
              </section>

              <h2 className="text-2xl font-medium">
                {t("features.sixthGraphic")}{" "}
                <span className="text-pink-500">{t("features.seventhGraphic")}</span>
                {t("features.eighthGraphic")}{" "}
                <span className="text-pink-500">{t("features.ninthGraphic")}</span>
              </h2>
            </article>

            <article className="border border-emerald-300 bg-emerald-100 text-emerald-900 lg:col-span-4 lg:row-span-2">
              <div>graphic 3</div>

              <h2 className="text-2xl font-medium">
                {t("features.tenthGraphic")}
                <span className="text-emerald-500">{t("features.eleventhGraphic")}</span>
                {t("features.twelfthGraphic")}{" "}
                <span className="text-emerald-500">{t("features.thirteenthGraphic")}</span>
              </h2>
            </article>

            <article className="border border-neutral-50 bg-primary text-neutral-50 lg:col-span-8 lg:row-span-2">
              <div>
                <LockClosedIcon className="size-6" />
                <HyperText text={t("features.hyperText")} />
              </div>

              <h2 className="text-2xl font-medium">
                {t("features.fourteenthGraphic")}{" "}
                <span className="text-muted-foreground">{t("features.fifteenthGraphic")}</span>{" "}
                <span>{t("features.sixteenthGraphic")}</span>
              </h2>
            </article>
          </section>
        </article>
      </section>

      <section
        id="comparison"
        className="-mb-10 flex items-center justify-center rounded-t-[24px] bg-white px-4 py-24 md:min-h-[1000px] md:px-10"
      >
        <article className="group w-full max-w-7xl space-y-10 rounded-[32px]">
          <section className="space-y-2">
            <p className="font-medium text-blue-600">{t("comparison.compare")}</p>
            <h2 className="text-4xl font-semibold tracking-tight">
              {t("comparison.before")}{" "}
              <span className="bg-gradient-to-r from-violet-700 to-purple-400 bg-clip-text text-transparent">
                {t("comparison.after")}
              </span>
            </h2>

            <p className="max-w-prose text-lg text-muted-foreground">{t("comparison.text")}</p>
          </section>

          <section className="grid grid-cols-1 gap-4 pb-10 md:grid-cols-2 md:gap-10">
            <Card className="rounded-[28px] border-dashed bg-zinc-100 p-3 shadow-none transition-all duration-300 group-hover:scale-95 group-hover:blur-sm md:p-6 md:group-hover:translate-x-1/2">
              <CardHeader>
                <CardTitle className="text-xl">{t("comparison.usualSubheading")}</CardTitle>
                <CardDescription className="text-base">
                  {t("comparison.usualHeading")}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <ul className="list-disc space-y-3 pl-4 text-lg font-light text-muted-foreground">
                  <li>{t("comparison.firstUsual")}</li>
                  <li>{t("comparison.secondUsual")}</li>
                  <li>{t("comparison.thirdUsual")}</li>
                  <li>{t("comparison.fourthUsual")}</li>
                  <li>
                    {t("comparison.fifthUsualPart1")}
                    <span className="font-medium italic">{t("comparison.fifthUsualPart2")}</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="relative rounded-[28px] border border-indigo-400 bg-primary p-3 text-primary-foreground shadow-xl shadow-violet-300 transition-all duration-300 group-hover:scale-110 md:p-6 md:group-hover:-translate-x-[calc(50%+2.5rem)] md:group-hover:translate-y-10">
              <CardHeader>
                <CardTitle className="text-2xl">ConCard</CardTitle>
                <CardDescription className="text-base">
                  {t("comparison.upgradeHeading")}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3 text-lg font-light text-zinc-200">
                  <li className="flex gap-3">
                    <Badge variant="violet">1</Badge>
                    <p>{t("comparison.firstUpgrade")}</p>
                  </li>

                  <li className="flex gap-3">
                    <Badge variant="violet">2</Badge>
                    <p>{t("comparison.secondUpgrade")}</p>
                  </li>

                  <li className="flex gap-3">
                    <Badge variant="violet">3</Badge>
                    <p>{t("comparison.thirdUpgrade")}</p>
                  </li>

                  <li className="flex gap-3">
                    <Badge variant="violet">4</Badge>
                    <p>{t("comparison.fourthUpgrade")}</p>
                  </li>

                  <li className="flex gap-3">
                    <Badge variant="violet">5</Badge>
                    <p>{t("comparison.fifthUpgrade")}</p>
                  </li>

                  <li className="flex gap-3">
                    <Badge variant="violet">6</Badge>
                    <p>{t("comparison.sixthUpgrade")}</p>
                  </li>

                  <li className="flex gap-3">
                    <Badge variant="violet">7</Badge>
                    <p>{t("comparison.seventhUpgrade")}</p>
                  </li>
                </ul>
              </CardContent>

              <CardFooter className="text-muted-foreground">
                <p className="text-sm">{t("comparison.bottomText")}</p>
              </CardFooter>

              <BorderBeam size={100} duration={10} delay={5} borderWidth={2} />
            </Card>
          </section>
        </article>
      </section>

      <section
        id="pricing"
        className="-mt-10 flex items-center justify-center bg-white bg-gradient-to-t px-4 py-10 md:min-h-[950px] md:px-10 md:pb-20"
      >
        <article className="w-full max-w-7xl space-y-14 rounded-[32px]">
          <div className="flex flex-col items-center justify-center space-y-2 text-center">
            <p className="font-semibold text-indigo-600">{t("pricing.title")}</p>
            <h2 className="text-4xl font-semibold tracking-tight">{t("pricing.description")}</h2>
            <p className="text-lg text-muted-foreground">{t("pricing.subheading")}</p>
          </div>

          <section className="group grid grid-cols-1 place-items-center gap-4 md:grid-cols-3">
            <Card className="hidden h-full translate-x-14 translate-y-10 rounded-[24px] border-dashed bg-zinc-50 p-4 shadow-none blur-sm transition-all duration-300 group-hover:translate-x-24 group-hover:-rotate-12 group-hover:scale-90 group-hover:blur-md md:block">
              <CardHeader>
                <CardTitle className="text-xl">Some plan</CardTitle>
                <CardDescription className="text-base">
                  Many brands usually offer way too many options, so we decided to keep it simple
                  and only offer a single plan
                </CardDescription>
              </CardHeader>

              <CardContent className="list-inside space-y-4 text-lg font-light text-muted-foreground">
                <li className="flex gap-2">
                  <Badge variant="outline">1</Badge>
                  <p>The landing page is nice, innit?</p>
                </li>
                <li className="flex gap-2">
                  <Badge variant="outline">2</Badge>
                  <p>Something that is not included</p>
                </li>
                <li className="flex gap-2">
                  <Badge variant="outline">3</Badge>
                  <p>You should read this</p>
                </li>
                <li className="flex gap-2">
                  <Badge variant="outline">4</Badge>
                  <p>Just placeholder text</p>
                </li>

                <li className="flex gap-2">
                  <Badge variant="outline">5</Badge>
                  <p>More unused text</p>
                </li>
                <li className="flex gap-2">
                  <Badge variant="outline">6</Badge>
                  <p>Something that is not included</p>
                </li>
              </CardContent>
            </Card>

            <Card className="relative z-10 h-full w-full rounded-[24px] border border-indigo-400 bg-gradient-to-br from-primary to-indigo-950 text-primary-foreground shadow-xl shadow-indigo-400 transition-all duration-300 group-hover:translate-y-5 group-hover:scale-105 md:p-4">
              <CardHeader>
                <p className="text-muted-foreground">{t("pricing.startingFrom")}</p>

                <div className="flex items-center gap-2">
                  <p className="text-xl font-light text-green-600 line-through">S/. 69.90</p>

                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoCircledIcon className="text-muted-foreground" />
                      </TooltipTrigger>

                      <TooltipContent className="text-sm">
                        {t("pricing.offerExplanation")}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <CardTitle className="text-2xl font-medium tabular-nums text-green-400">
                  S/. 49.90 PEN
                </CardTitle>
                <CardTitle className="text-2xl">{t("pricing.planName")}</CardTitle>
                <CardDescription className="text-base">
                  {t("pricing.planDescription")}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <ul className="space-y-4 font-light text-zinc-200 md:text-lg">
                  <li className="flex gap-3">
                    <Badge variant="secondary">1</Badge>
                    <p>{t("pricing.firstIncluded")}</p>
                  </li>

                  <li className="flex gap-3">
                    <Badge variant="secondary">2</Badge>
                    <p>{t("pricing.secondIncluded")}</p>
                  </li>

                  <li className="flex gap-3">
                    <Badge variant="secondary">3</Badge>
                    <p>{t("pricing.thirdIncluded")}</p>
                  </li>

                  <li className="flex gap-3">
                    <Badge variant="secondary">4</Badge>
                    <p>{t("pricing.fourthIncluded")}</p>
                  </li>

                  <li className="flex gap-3">
                    <Badge variant="secondary">5</Badge>
                    <p>{t("pricing.fifthIncluded")}</p>
                  </li>

                  <li className="flex gap-3">
                    <Badge variant="secondary">6</Badge>
                    <p>{t("pricing.sixthIncluded")}</p>
                  </li>

                  <li className="flex gap-3">
                    <Badge variant="secondary">7</Badge>
                    <p>{t("pricing.seventhIncluded")}</p>
                  </li>
                </ul>
              </CardContent>

              <CardFooter>
                <SignUpButton>
                  <Button variant="primary" className="w-full" size="lg">
                    <MagicWandIcon className="h-5 w-5" />
                    {t("pricing.primaryButton")}
                  </Button>
                </SignUpButton>
              </CardFooter>

              <BorderBeam size={100} duration={10} delay={5} borderWidth={2} />
            </Card>

            <Card className="hidden h-full -translate-x-14 translate-y-10 rounded-[24px] border-dashed bg-zinc-50 p-4 shadow-none blur-sm transition-all duration-300 group-hover:-translate-x-24 group-hover:rotate-12 group-hover:scale-90 group-hover:blur-md md:block">
              <CardHeader>
                <CardTitle className="text-xl">Another plan</CardTitle>
                <CardDescription className="text-base">
                  Some other plan not offered by us that is more expensive without much additional
                  benefits
                </CardDescription>
              </CardHeader>

              <CardContent className="list-inside space-y-4 text-lg font-light text-muted-foreground">
                <li className="flex gap-2">
                  <Badge variant="outline">1</Badge>
                  <p>The landing page is nice, innit?</p>
                </li>
                <li className="flex gap-2">
                  <Badge variant="outline">2</Badge>
                  <p>Something that is not included</p>
                </li>
                <li className="flex gap-2">
                  <Badge variant="outline">3</Badge>
                  <p>You should read this</p>
                </li>
                <li className="flex gap-2">
                  <Badge variant="outline">4</Badge>
                  <p>Just placeholder text</p>
                </li>

                <li className="flex gap-2">
                  <Badge variant="outline">5</Badge>
                  <p>More unused text</p>
                </li>
                <li className="flex gap-2">
                  <Badge variant="outline">6</Badge>
                  <p>Something that is not included</p>
                </li>
              </CardContent>
            </Card>
          </section>
        </article>
      </section>

      <article className="p-10">
        <section id="security" className="mx-auto w-full max-w-7xl">
          <header className="space-y-2">
            <p className="font-medium text-pink-700">FAQ</p>
            <h2 className="text-4xl font-semibold tracking-tight">{t("faq.subheading")}</h2>
            <p className="text-muted-foreground">
              {t("faq.message")}{" "}
              <Link href="mailto:help@stackkstudios.com" className="text-primary underline">
                help@stackkstudios.com
              </Link>
            </p>
          </header>

          <Accordion type="single" collapsible className="mt-8 w-full">
            <AccordionItem value="explain-nfc">
              <AccordionTrigger className="h-20 text-2xl font-medium md:h-20">
                {t("faq.questionOne")}
              </AccordionTrigger>

              <AccordionContent className="text-lg font-light" accessKey="explain-nfc">
                {t("faq.answerOne")}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="purchases">
              <AccordionTrigger className="h-24 text-2xl font-medium md:h-20">
                {t("faq.questionTwo")}
              </AccordionTrigger>

              <AccordionContent className="text-lg font-light" accessKey="purchases">
                {t("faq.answerTwoPart1")}{" "}
                <SignUpButton>
                  <button className="font-medium underline underline-offset-2 hover:text-indigo-700">
                    {t("faq.answerTwoPart2")}
                  </button>
                </SignUpButton>{" "}
                {t("faq.answerTwoPart3")}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="compatibility">
              <AccordionTrigger className="h-24 text-2xl font-medium md:h-20">
                {t("faq.questionThree")}
              </AccordionTrigger>

              <AccordionContent className="text-lg font-light" accessKey="how-it-works">
                {t("faq.answerThree")}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="how-it-works">
              <AccordionTrigger className="h-20 text-2xl font-medium md:h-20">
                {t("faq.questionFour")}
              </AccordionTrigger>
              <AccordionContent className="text-lg font-light" accessKey="how-it-works">
                {t("faq.answerFour")}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="security">
              <AccordionTrigger className="h-28 text-2xl font-medium md:h-20">
                {t("faq.questionFive")}
              </AccordionTrigger>

              <AccordionContent className="text-lg font-light">
                {t("faq.answerFive")}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="shipping">
              <AccordionTrigger className="h-28 text-2xl font-medium md:h-20">
                {t("faq.questionSix")}
              </AccordionTrigger>

              <AccordionContent className="text-lg font-light">
                {t("faq.answerSix")}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
      </article>

      <footer className="mt-20 flex flex-col justify-end gap-10 rounded-t-[32px] bg-neutral-900 px-4 py-8 text-center text-neutral-400 shadow-xl md:px-10">
        <section className="flex w-full flex-wrap items-center justify-center gap-5">
          <Button asChild variant="link" className="group text-base hover:text-primary-foreground">
            <Link href="/admin">
              {t("footer.getStarted")}
              <LightningBoltIcon className="transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>

          <Button asChild variant="link" className="group text-base hover:text-primary-foreground">
            <Link href="mailto:help@stackkstudios.com">{t("footer.contact")}</Link>
          </Button>

          <Button asChild variant="link" className="group text-base hover:text-primary-foreground">
            <Link href="/">{t("footer.aboutUs")}</Link>
          </Button>

          <Button asChild variant="link" className="group text-base hover:text-primary-foreground">
            <Link href="/">{t("footer.termsOfService")}</Link>
          </Button>

          <Button asChild variant="link" className="group text-base hover:text-primary-foreground">
            <Link href="/">{t("footer.privacyPolicy")}</Link>
          </Button>
        </section>

        <div className="flex items-center justify-center gap-2">
          <p>Powered by</p>

          <Link
            target="_blank"
            className="flex items-center gap-2 underline-offset-2 transition-all hover:text-indigo-400 hover:underline"
            href={{
              pathname: "https://stackkstudios.com",
            }}
          >
            Stackk Studios <OpenInNewWindowIcon />
          </Link>
        </div>
      </footer>
    </main>
  );
}

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
}) => {
  return (
    <figure
      className={cn(
        "relative w-72 cursor-pointer overflow-hidden rounded-3xl border p-6 transition-colors",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-indigo-50/50",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <Image className="rounded-full" width={32} height={32} alt="avatar" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-xs font-medium">{name}</figcaption>
          <p className="text-sm dark:text-white/40">{username}</p>
        </div>
      </div>

      <blockquote className="mt-3 text-sm">{body}</blockquote>
    </figure>
  );
};
