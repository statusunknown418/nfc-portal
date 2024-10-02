import { ClerkLoading, SignedIn, SignedOut, SignUpButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import {
  ArrowDownIcon,
  ArrowRightIcon,
  ChevronRightIcon,
  OpenInNewWindowIcon,
  QuestionMarkCircledIcon,
} from "@radix-ui/react-icons";
import Image from "next/image";
import Link from "next/link";
import AnimatedGridPattern from "~/components/magicui/animated-grid-pattern";
import BlurFade from "~/components/magicui/blur-fade";
import { BorderBeam } from "~/components/magicui/border-beam";
import Marquee from "~/components/magicui/marquee";
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
import { cn } from "~/lib/utils";
import { HydrateClient } from "~/trpc/server";

const reviews = [
  // Usuario & cargo/puesto - company
  {
    name: "Juan",
    username: "@j.pa****",
    body: "Biomedical Engineering student. I like it 👍.",
    img: "https://avatar.vercel.sh/jose?text=jose.h",
  },
  {
    name: "Boris",
    username: "@bdi****",
    body: "CEO at CI** Peru, this has been a great experience!",
    img: "https://avatar.vercel.sh/jill?text=boris.d",
  },
  {
    name: "Martina",
    username: "@mar****",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/john?text=martina.m",
  },
  {
    name: "Jane",
    username: "@jane08****",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/jane?text=JO",
  },
  {
    name: "Kimberly",
    username: "@kim****",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/kimberly?text=kimberly.c",
  },
  {
    name: "Francisco",
    username: "@fr.****",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/francisco?text=FD",
  },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

export default async function Home() {
  const { sessionClaims } = auth();

  return (
    <HydrateClient>
      <main className="relative flex flex-col items-stretch gap-10 bg-neutral-50">
        <div className="sticky inset-0 z-10 flex h-16 w-full items-end justify-center px-2">
          <header className="flex h-12 w-full max-w-7xl items-center justify-between rounded-lg border border-border/50 bg-white px-2 py-2 backdrop-blur-lg backdrop-filter">
            <Link href={"/"}>
              <p>Logo</p>
            </Link>

            <ul className="hidden md:flex">
              <Button asChild variant="ghost">
                <Link href={"/#features"}>Features</Link>
              </Button>

              <Button asChild variant="ghost">
                <Link href={"/#customers"}>Customers</Link>
              </Button>

              <Button asChild variant="ghost">
                <Link href={"/#security"}>Security</Link>
              </Button>

              <Button asChild variant="ghost">
                <Link href={"#pricing"}>Pricing</Link>
              </Button>
            </ul>

            {!sessionClaims?.username && (
              <ClerkLoading>
                <Skeleton className="h-9 w-28" />
              </ClerkLoading>
            )}

            <SignedIn>
              <Button asChild className="rounded-full">
                <Link href="/admin">
                  Dashboard <ChevronRightIcon />
                </Link>
              </Button>
            </SignedIn>

            <SignedOut>
              <SignUpButton>
                <Button className="rounded-full">
                  Join now <ArrowRightIcon />
                </Button>
              </SignUpButton>
            </SignedOut>
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
          className="relative flex min-h-[calc(100vh-9rem)] flex-col items-center justify-center gap-16"
        >
          <section className="relative mx-auto w-full max-w-7xl px-5 md:px-10">
            <article className="flex flex-col items-center gap-7">
              <BlurFade delay={0.25 * 2}>
                <Badge>
                  ✨ Introducing premium cards <ArrowRightIcon />
                </Badge>
              </BlurFade>

              <BlurFade>
                <h1 className="text-center text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
                  Discover a new era of networking, powered by{" "}
                  <span className="bg-gradient-to-r from-indigo-700 via-violet-500 to-purple-400 bg-clip-text text-transparent">
                    NFC
                  </span>{" "}
                  technology
                </h1>
              </BlurFade>

              <BlurFade delay={0.25}>
                <p className="max-w-sm text-pretty text-center text-muted-foreground sm:text-lg md:max-w-lg md:text-xl lg:max-w-4xl">
                  Supercharge your experience and stand up to the competition with our premium
                  business cards, simply approach it to someone&apos;s phone and share your own
                  custom-made personal page!
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
                        Get started
                        <ChevronRightIcon className="transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </SignUpButton>

                  <Button asChild variant="ghost" size="lg" className="group">
                    <Link href="#features">
                      Why us?
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
            Learn more
          </Button>
        </div>

        <section className="border-border/50 bg-white py-24" id="customers">
          <article className="relative mx-auto max-w-7xl">
            <h3 className="text-center text-lg font-medium uppercase text-muted-foreground">
              Trusted by professionals across different industries
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
          </article>
        </section>

        <section
          id="features"
          className="flex items-center justify-center bg-gradient-to-t px-4 py-10 md:px-10 md:pb-20"
        >
          <article className="w-full max-w-7xl space-y-8 rounded-[32px]">
            <div className="space-y-2">
              <p className="font-semibold text-indigo-600">Features</p>

              <h2 className="text-4xl font-semibold tracking-tight">Benefits, and why us?</h2>

              <p className="max-w-prose text-lg text-muted-foreground">
                Explore countless benefits of using our product, and why we are the best choice for
                you
              </p>
            </div>

            <section className="grid min-h-[800px] grid-cols-1 gap-4 *:flex *:flex-col *:gap-6 *:rounded-[24px] *:p-6 lg:grid-cols-12 lg:grid-rows-4">
              <article className="group border border-indigo-300 bg-indigo-100 text-indigo-900 lg:col-span-8 lg:row-span-2">
                <div>graphic 1</div>

                <h2 className="text-2xl font-medium">
                  <span className="transition-all group-hover:text-indigo-400">
                    Extremely easy to use,
                  </span>{" "}
                  <span className="text-indigo-400 transition-all group-hover:text-inherit">
                    get started in just a few minutes
                  </span>{" "}
                  <span className="transition-all group-hover:text-indigo-400">
                    and stand out from the competition{" "}
                  </span>
                  <span className="text-indigo-400 transition-all group-hover:text-inherit">
                    by showcasing your work in a unique and professional way
                  </span>
                </h2>
              </article>

              <article className="border border-pink-300 bg-pink-100 text-pink-900 lg:col-span-4 lg:row-span-2">
                <div>graphic 2</div>

                <h2 className="text-2xl font-medium">
                  Highly customizable,{" "}
                  <span className="text-pink-500">we offer a wide range of options</span> to make
                  your portal and business card truly{" "}
                  <span className="text-pink-500">yours and unique</span>
                </h2>
              </article>

              <article className="border border-emerald-300 bg-emerald-100 text-emerald-900 lg:col-span-4 lg:row-span-2">
                <div>graphic 3</div>

                <h2 className="text-2xl font-medium">
                  No external applications required,{" "}
                  <span className="text-emerald-500">it works right out of the box</span> on all iOS
                  devices and <span className="text-emerald-500"> most Android phones</span>
                </h2>
              </article>

              <article className="border border-neutral-50 bg-primary text-neutral-50 lg:col-span-8 lg:row-span-2">
                <div>graphic 4</div>

                <h2 className="text-2xl font-medium">
                  Secure information,{" "}
                  <span className="text-muted-foreground">
                    no one is able to see your personal contact unless you
                  </span>{" "}
                  <span>explicitly share it</span>{" "}
                  <span className="text-muted-foreground">
                    by approaching one of your business cards
                  </span>
                </h2>
              </article>
            </section>
          </article>
        </section>

        <section
          id="comparison"
          className="-mb-10 flex items-center justify-center bg-white px-4 py-24 md:min-h-[1000px] md:px-10"
        >
          <article className="w-full max-w-7xl space-y-10 rounded-[32px]">
            <section className="space-y-2">
              <p className="font-medium text-blue-600">Compare it by yourself</p>
              <h2 className="text-4xl font-semibold tracking-tight">
                The old way vs{" "}
                <span className="bg-gradient-to-r from-violet-700 to-purple-400 bg-clip-text text-transparent">
                  New way
                </span>
              </h2>

              <p className="max-w-prose text-lg text-muted-foreground">
                The usual way to share information is to send a text message or email. But what if
                you want to share your contact information with someone without having to type it
                out?
              </p>
            </section>

            <section className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-10">
              <Card className="rounded-[28px] border-dashed bg-zinc-100 p-3 shadow-none md:p-6">
                <CardHeader>
                  <CardTitle className="text-xl">Others</CardTitle>
                  <CardDescription className="text-base">
                    The usual way, nothing special
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <ul className="list-disc space-y-3 pl-4 text-lg font-light text-muted-foreground">
                    <li>Plain link in bio (not always offered)</li>
                    <li>Will most likely be require an app</li>
                    <li>Not useful to show off</li>
                    <li>Traditional printed cards may harm the environment</li>
                    <li>
                      Works ... but it&apos;s <span className="font-medium italic">boring</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="relative rounded-[28px] border border-indigo-400 bg-primary p-3 text-primary-foreground shadow-xl shadow-violet-300 md:p-6">
                <CardHeader>
                  <CardTitle className="text-2xl">ConCard</CardTitle>
                  <CardDescription className="text-base">
                    Improve your professional profile
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-3 text-lg font-light text-zinc-200">
                    <li className="flex gap-3">
                      <Badge variant="violet">1</Badge>
                      <p>Customizable NFC business card ✨</p>
                    </li>

                    <li className="flex gap-3">
                      <Badge variant="violet">2</Badge>
                      <p>Make your own public personal page</p>
                    </li>

                    <li className="flex gap-3">
                      <Badge variant="violet">3</Badge>
                      <p>Secure information</p>
                    </li>

                    <li className="flex gap-3">
                      <Badge variant="violet">4</Badge>
                      <p>No need to install anything</p>
                    </li>

                    <li className="flex gap-3">
                      <Badge variant="violet">5</Badge>
                      <p>Enhance your personal brand</p>
                    </li>

                    <li className="flex gap-3">
                      <Badge variant="violet">6</Badge>
                      <p>Buy one ... or a lot!</p>
                    </li>
                  </ul>
                </CardContent>

                <CardFooter className="text-muted-foreground">
                  <p className="text-sm">Think of LinkTree but much better</p>
                </CardFooter>

                <BorderBeam size={100} duration={10} delay={5} borderWidth={2} />
              </Card>
            </section>
          </article>
        </section>

        <div className="flex min-h-screen items-center bg-gradient-to-br from-neutral-950 via-neutral-800 to-neutral-950 py-20 text-neutral-200">
          <section
            id="how-it-works"
            className="mx-auto flex w-full max-w-7xl flex-col gap-10 p-4 md:gap-14"
          >
            <header className="space-y-2 px-4 md:px-6">
              <p className="font-medium text-emerald-400">An explanation</p>
              <h2 className="text-4xl font-semibold tracking-tight">But how does it work?</h2>
              <p className="text-muted-foreground">
                We use a combination of technologies to make our product stand out
              </p>
            </header>

            <div className="grid grid-cols-1 *:space-y-3 *:border-b *:border-border/20 *:px-4 *:py-6 md:grid-cols-2 md:justify-items-stretch md:gap-0 md:*:space-y-5 md:*:border-r md:*:px-8 md:*:py-10">
              <article className="border-b">
                <Badge variant="secondary">1</Badge>

                <section>
                  <h3 className="text-lg font-medium">Sign up and reserve your username</h3>
                  <p className="text-muted-foreground">
                    You can use an email or social media account to sign up
                  </p>
                </section>

                <div className="flex h-52 w-full items-center justify-center bg-neutral-700">
                  add graphic
                </div>
              </article>

              <article className="!border-r-0 border-b">
                <Badge variant="secondary">2</Badge>

                <section>
                  <h3 className="text-lg font-medium">Add your contact information</h3>
                  <p className="text-muted-foreground">
                    Anything you want to share with your contacts
                  </p>
                </section>

                <div className="flex h-52 w-full items-center justify-center bg-neutral-700">
                  add graphic
                </div>
              </article>

              <article className="border-b">
                <Badge variant="secondary">3</Badge>

                <section>
                  <h3 className="text-lg font-medium">Customize your page</h3>
                  <p className="text-muted-foreground">
                    You can add your own content and customize your page
                  </p>
                </section>

                <div className="flex h-52 w-full items-center justify-center bg-neutral-700">
                  add graphic
                </div>
              </article>

              <article className="!border-r-0 border-b">
                <Badge variant="secondary">4</Badge>

                <section>
                  <h3 className="text-lg font-medium">Purchase an NFC card</h3>
                  <p className="text-muted-foreground">Choose from a variety of options</p>
                </section>

                <div className="flex h-52 w-full items-center justify-center bg-neutral-700">
                  add graphic
                </div>
              </article>

              <article className="border-none md:col-span-2">
                <Badge variant="secondary">5</Badge>

                <section>
                  <h3 className="text-lg font-medium">Use it anywhere!</h3>
                  <p className="max-w-prose text-muted-foreground">
                    No need to install anything, simply approach it to someone&apos;s phone and
                    share your page, including your contact information!
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
          id="pricing"
          className="-mt-10 flex items-center justify-center bg-white bg-gradient-to-t px-4 py-10 md:min-h-[950px] md:px-10 md:pb-20"
        >
          <article className="w-full max-w-7xl space-y-14 rounded-[32px]">
            <div className="flex flex-col items-center justify-center space-y-2 text-center">
              <p className="font-semibold text-indigo-600">Pricing</p>
              <h2 className="text-4xl font-semibold tracking-tight">
                Dead simple pricing, no hidden costs
              </h2>
              <p className="text-muted-foreground">
                We offer a single plan for all our individual customers, so you can focus on what
                matters most
              </p>
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
                  <p className="text-muted-foreground">Starts at</p>
                  <CardTitle className="text-xl font-normal text-green-400">
                    S/. 49.90 PEN
                  </CardTitle>
                  <CardTitle className="text-2xl">Professional</CardTitle>
                  <CardDescription className="text-base">
                    Single, affordable and flexible plan, perfect for everyone, it includes:
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-4 font-light text-zinc-200 md:text-lg">
                    <li className="flex gap-3">
                      <Badge variant="secondary">1</Badge>
                      <p>1 business card included</p>
                    </li>

                    <li className="flex gap-3">
                      <Badge variant="secondary">2</Badge>
                      <p>Free shipping! (Lima)</p>
                    </li>

                    <li className="flex gap-3">
                      <Badge variant="secondary">3</Badge>
                      <p>All page customization options</p>
                    </li>

                    <li className="flex gap-3">
                      <Badge variant="secondary">4</Badge>
                      <p>Social/professional links </p>
                    </li>

                    <li className="flex gap-3">
                      <Badge variant="secondary">5</Badge>
                      <p>High security for your information</p>
                    </li>

                    <li className="flex gap-3">
                      <Badge variant="secondary">6</Badge>
                      <p>Email signatures</p>
                    </li>

                    <li className="flex gap-3">
                      <Badge variant="secondary">7</Badge>
                      <p>And more!</p>
                    </li>
                  </ul>
                </CardContent>

                <CardFooter>
                  <SignUpButton>
                    <Button variant="primary" className="w-full" size="lg">
                      Start now!
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
              <h2 className="text-4xl font-semibold tracking-tight">Any doubts?</h2>
              <p className="text-muted-foreground">
                If none of these answers your question, feel free to contact us at{" "}
                <Link href="mailto:help@stackkstudios.com" className="text-primary underline">
                  help@stackkstudios.com
                </Link>
              </p>
            </header>

            <Accordion type="single" collapsible className="mt-8 w-full">
              <AccordionItem value="explain-nfc">
                <AccordionTrigger className="h-20 text-2xl font-medium">
                  What is NFC?
                </AccordionTrigger>

                <AccordionContent className="text-lg font-light" accessKey="explain-nfc">
                  NFC stands for Near Field Communication, which is a technology that allows two
                  devices to communicate with each other over a short distance, aka what powers
                  Apple Pay and Google Pay. ConCard uses it to enable you to share any contact
                  information with others without the need for them to install any additional
                  applications.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="purchases">
                <AccordionTrigger className="h-20 text-2xl font-medium">
                  How do I purchase a card?
                </AccordionTrigger>
                <AccordionContent className="text-lg font-light" accessKey="purchases">
                  To purchase a card, you can visit the official website of the company and follow
                  the instructions provided. Once you have completed the purchase, you will receive
                  a unique code that you can use to redeem your card.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="how-it-works">
                <AccordionTrigger className="h-20 text-2xl font-medium">
                  How does it work?
                </AccordionTrigger>
                <AccordionContent className="text-lg font-light" accessKey="how-it-works">
                  The process of using a card involves several steps. First, you need to register
                  your username and create a profile. Then, you can add your contact information and
                  customize your page. Finally, you can purchase a card and use it to share your
                  information with others.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="security">
                <AccordionTrigger className="h-20 text-2xl font-medium">
                  What if someone finds out my username by accident?
                </AccordionTrigger>

                <AccordionContent className="text-lg font-light">
                  Don&apos;t worry, we take your privacy seriously and have architected a system in
                  place to ensure the security of your information, all pages are encrypted and only
                  accessible when you explicitly open it by approaching your card to someone&apos;s
                  phone.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>
        </article>

        <footer className="mt-20 flex flex-col justify-end gap-10 rounded-t-[32px] bg-neutral-900 px-4 py-8 text-center text-neutral-400 shadow-xl md:px-10">
          <section className="flex w-full flex-wrap items-center justify-center gap-5">
            <Button
              asChild
              variant="link"
              className="group text-base hover:text-primary-foreground"
            >
              <Link href="/admin">
                Get started
                <ChevronRightIcon className="transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>

            <Button
              asChild
              variant="link"
              className="group text-base hover:text-primary-foreground"
            >
              <Link href="mailto:help@stackkstudios.com">Contact us</Link>
            </Button>

            <Button
              asChild
              variant="link"
              className="group text-base hover:text-primary-foreground"
            >
              <Link href="mailto:help@stackkstudios.com">Terms of service</Link>
            </Button>

            <Button
              asChild
              variant="link"
              className="group text-base hover:text-primary-foreground"
            >
              <Link href="mailto:help@stackkstudios.com">Privacy policy</Link>
            </Button>
          </section>

          <div className="flex items-center justify-center gap-2">
            <p>A project by </p>

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
    </HydrateClient>
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
        "relative w-64 cursor-pointer overflow-hidden rounded-lg border p-5",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <Image className="rounded-full" width={32} height={32} alt="avatar" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">{name}</figcaption>
          <p className="text-xs font-medium dark:text-white/40">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{body}</blockquote>
    </figure>
  );
};
