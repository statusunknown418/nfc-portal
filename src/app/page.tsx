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
import { BorderBeam } from "~/components/magicui/border-beam";
import Marquee from "~/components/magicui/marquee";
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
      <main className="relative flex flex-col items-stretch gap-10">
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
                <Skeleton className="h-9 w-32" />
              </ClerkLoading>
            )}

            <SignedIn>
              <Button asChild>
                <Link href="/admin">
                  Dashboard <ChevronRightIcon />
                </Link>
              </Button>
            </SignedIn>

            <SignedOut>
              <SignUpButton>
                <Button>
                  Join now <ArrowRightIcon />
                </Button>
              </SignUpButton>
            </SignedOut>
          </header>
        </div>

        <div
          id="hero"
          className="flex min-h-[calc(100vh-9rem)] flex-col items-center justify-center gap-16"
        >
          <section className="relative mx-auto w-full max-w-6xl px-5 md:px-10">
            <article className="flex flex-col items-center gap-6">
              <Badge>
                ✨ Introducing NFC cards <ArrowRightIcon />
              </Badge>

              <h1 className="text-center text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
                Discover a new era of networking, powered by{" "}
                <span className="bg-gradient-to-r from-indigo-700 via-violet-500 to-purple-400 bg-clip-text text-transparent">
                  NFC
                </span>{" "}
                technology
              </h1>

              <p className="max-w-sm text-pretty text-center text-muted-foreground sm:text-lg md:max-w-lg md:text-xl lg:max-w-4xl">
                Supercharge your experience and stand up to the competition with our premium
                business cards, simply approach it to someone&apos;s phone and share your own
                custom-made personal page!
              </p>

              <div className="flex flex-col items-center justify-center gap-2 md:flex-row">
                <Button asChild variant="primary" size="lg" className="group w-full sm:w-auto">
                  <Link href="/admin">
                    Get started
                    <ChevronRightIcon className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>

                <Button asChild variant="ghost" size="lg" className="group">
                  <Link href="#features">
                    Why us?
                    <QuestionMarkCircledIcon className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </article>
          </section>

          <article className="w-full max-w-6xl px-4">
            <div className="flex aspect-video w-full items-center justify-center rounded-2xl border border-border/50 shadow-xl">
              Video or card animation
            </div>
          </article>

          <Button variant="ghost">
            <ArrowDownIcon />
            Learn more
          </Button>
        </div>

        <section className="border-border/50 bg-white py-24" id="customers">
          <article className="relative mx-auto max-w-6xl">
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
          className="flex items-center justify-center bg-gradient-to-t py-10 md:pb-20"
        >
          <article className="w-full max-w-6xl space-y-8 rounded-[32px] px-10">
            <div className="space-y-2">
              <p className="font-semibold text-indigo-600">Features</p>

              <h2 className="text-4xl font-semibold tracking-tight">Benefits, and why us?</h2>

              <p className="max-w-prose text-lg text-muted-foreground">
                Explore countless benefits of using our product, and why we are the best choice for
                you
              </p>
            </div>

            <section className="grid min-h-[800px] grid-cols-1 gap-4 *:flex *:flex-col *:gap-6 *:rounded-[24px] *:p-6 lg:grid-cols-12 lg:grid-rows-4">
              <article className="group col-span-8 row-span-2 border border-indigo-400 bg-indigo-100 text-indigo-900">
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

              <article className="col-span-4 row-span-2 border border-pink-400 bg-pink-100 text-pink-900">
                <div>graphic 2</div>

                <h2 className="text-2xl font-medium">
                  Highly customizable,{" "}
                  <span className="text-pink-400">we offer a wide range of options</span> to make
                  your portal and business card truly{" "}
                  <span className="text-pink-400">yours and unique</span>
                </h2>
              </article>

              <article className="col-span-4 row-span-2 border border-emerald-400 bg-emerald-100 text-emerald-900">
                <div>graphic 3</div>

                <h2 className="text-2xl font-medium">
                  No external applications required,{" "}
                  <span className="text-emerald-600">it works right out of the box</span> on all iOS
                  devices and most Android phones
                </h2>
              </article>

              <article className="col-span-8 row-span-2 border border-neutral-50 bg-primary text-neutral-50">
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

        <section id="comparison" className="-mb-10 flex items-center justify-center bg-white py-24">
          <article className="w-full max-w-6xl space-y-8 rounded-[32px] px-10">
            <section className="space-y-2">
              <p className="font-medium text-blue-600">Compare it by yourself</p>
              <h2 className="text-4xl font-semibold tracking-tight">
                The old vs <span className="text-violet-700">New way</span>
              </h2>

              <p className="max-w-prose text-lg text-muted-foreground">
                The usual way to share information is to send a text message or email. But what if
                you want to share your contact information with someone without having to type it
                out?
              </p>
            </section>

            <section className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-10">
              <Card className="rounded-[24px] border-dashed bg-zinc-100 p-4 shadow-none">
                <CardHeader>
                  <CardTitle className="text-xl">Others</CardTitle>
                  <CardDescription className="text-base">
                    The usual way, nothing special
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <ul className="list-disc space-y-1.5 pl-4 text-lg font-light">
                    <li>Plain link in bio</li>
                    <li>Will most likely be require an app</li>
                    <li>Not useful to show off</li>
                    <li>Boring ... but it works</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="relative rounded-[24px] border border-indigo-400 bg-primary p-4 text-primary-foreground shadow-xl shadow-indigo-300">
                <CardHeader>
                  <CardTitle className="text-xl">ConCard</CardTitle>
                  <CardDescription className="text-base">
                    Improve your professional profile
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-1.5 text-lg font-light">
                    <li>Customizable NFC business card</li>
                    <li>Make your own public personal page</li>
                    <li>Secure contact information</li>
                    <li>No need to install anything</li>
                    <li>Buy one ... or a lot!</li>
                  </ul>
                </CardContent>

                <CardFooter className="justify-center text-muted-foreground">
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
            className="mx-auto flex w-full max-w-6xl flex-col gap-8 p-4 md:gap-14"
          >
            <header className="space-y-2 px-4 md:px-6">
              <p className="font-medium text-emerald-400">An explanation</p>
              <h2 className="text-4xl font-medium">But how does it work?</h2>
              <p className="text-muted-foreground">
                We use a combination of technologies to make our product stand out
              </p>
            </header>

            <div className="grid grid-cols-1 *:space-y-3 *:border-b *:border-border/20 *:px-4 *:py-8 md:grid-cols-2 md:justify-items-stretch md:gap-0 md:*:space-y-5 md:*:border-r md:*:p-6">
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

        <section id="security" className="mx-auto w-full max-w-6xl p-10">
          <header className="space-y-2">
            <QuestionMarkCircledIcon className="inline-block h-6 w-6" />
            <h2 className="text-4xl font-medium">FAQ</h2>
            <p className="text-muted-foreground">Have doubts? Check this out</p>
          </header>
        </section>

        <footer className="mt-20 flex flex-col justify-end gap-10 rounded-t-[32px] bg-gradient-to-t from-neutral-950 to-neutral-700 px-4 py-8 text-center text-neutral-400 shadow-xl md:px-10">
          <section className="flex w-full items-center justify-center gap-5">
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
