import { ClerkLoading, SignedIn, SignedOut, SignUpButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import {
  ArrowRightIcon,
  ChevronRightIcon,
  OpenInNewWindowIcon,
  QuestionMarkCircledIcon,
} from "@radix-ui/react-icons";
import Image from "next/image";
import Link from "next/link";
import { BorderBeam } from "~/components/magicui/border-beam";
import HyperText from "~/components/magicui/hyper-text";
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
    name: "José",
    username: "@jos****",
    body: "Biomedical Engineering student. I love it.",
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
      <main className="relative flex flex-col gap-10">
        <div className="sticky inset-0 z-10">
          <header className="flex items-center justify-between rounded-b-lg border-x border-b border-border/50 bg-background px-4 py-2 backdrop-blur-lg backdrop-filter md:px-10">
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

        <div id="hero" className="pt-10">
          <section className="relative mx-auto w-full max-w-6xl px-5 py-10 md:px-10">
            <article className="space-y-5">
              <h1 className="flex items-center justify-center gap-0 text-center text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
                Discover a new era of networking
              </h1>

              <p className="mx-auto max-w-sm text-pretty text-center text-muted-foreground sm:text-lg md:max-w-lg md:text-xl lg:max-w-4xl">
                Supercharge your experience and stand up to the competition with our premium NFC
                business cards, simply approach it to someone&apos;s phone and share a beautiful
                personal portal page!
              </p>

              <div className="flex flex-col items-center justify-center gap-2 md:flex-row">
                <Button asChild size="lg" className="group w-full sm:w-auto">
                  <Link href="/admin">
                    Get started
                    <ArrowRightIcon className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>

                <Button asChild variant="ghost" size="lg" className="group">
                  <Link href="/admin">
                    Why us?
                    <QuestionMarkCircledIcon className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </article>

            <article className="mt-5 sm:mt-10">
              <div className="flex aspect-video w-full items-center justify-center rounded-2xl border border-border/50">
                Video or card animation
              </div>
            </article>
          </section>
        </div>

        <section className="my-10 border-y bg-white py-20">
          <article className="relative mx-auto max-w-6xl">
            <h3 className="text-center text-lg font-medium uppercase text-muted-foreground">
              Trusted by professionals across different industries
            </h3>
            {/* <p className="text-center text-base text-muted-foreground md:text-lg">
              Currently used by professionals across all industries and disciplines
            </p> */}

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

        <section id="features" className="mb-10">
          <article className="mx-auto max-w-6xl space-y-8 rounded-[32px] p-10">
            <section className="space-y-3">
              <h2 className="text-4xl font-medium tracking-tight">Why choose us?</h2>

              <p className="max-w-prose text-lg text-muted-foreground">
                The usual way to share information is to send a text message or email. But what if
                you want to share your contact information with someone without having to type it
                out?
              </p>
            </section>

            <section className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-10">
              <Card className="relative rounded-[24px] border border-indigo-400 p-4">
                <CardHeader>
                  <CardTitle className="text-xl">ConCard</CardTitle>
                  <CardDescription className="text-base">
                    Improve your professional profile
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-1.5">
                    <li>✅ Customizable NFC business card</li>
                    <li>✅ Make your own public personal page</li>
                    <li>✅ Secure contact information</li>
                    <li>✅ No need to install anything</li>
                    <li>✅ Buy one ... or a lot!</li>
                  </ul>
                </CardContent>

                <CardFooter className="justify-center text-muted-foreground">
                  <p className="text-sm">Think of LinkTree but much better</p>
                </CardFooter>

                <BorderBeam size={100} duration={10} delay={5} borderWidth={2} />
              </Card>

              <Card className="rounded-[24px] border-dashed bg-muted p-4">
                <CardHeader>
                  <CardTitle className="text-xl">Others</CardTitle>
                  <CardDescription className="text-base">
                    The usual way, nothing special
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <ul className="list-disc space-y-1.5 pl-4">
                    <li>Plain link in bio</li>
                    <li>Will most likely be require an app</li>
                    <li>Not useful to show off</li>
                    <li>Boring ... but it works</li>
                  </ul>
                </CardContent>
              </Card>
            </section>
          </article>
        </section>

        <div className="bg-gradient-to-br from-neutral-950 via-neutral-800 to-neutral-950 py-20 text-neutral-200">
          <section id="how-it-works" className="mx-auto flex w-full max-w-6xl flex-col gap-14 p-10">
            <header className="space-y-2">
              <h2 className="text-4xl font-medium">But how does it work?</h2>
              <p className="text-muted-foreground">
                We use a combination of technologies to make our product stand out
              </p>
            </header>

            <div className="grid grid-cols-1 justify-items-stretch gap-0 *:space-y-3 *:border-r *:border-border/20 *:p-6 md:grid-cols-2">
              <article className="border-b">
                <Badge variant="secondary">1</Badge>

                <h3 className="text-lg font-medium">Sign up and reserve your username</h3>
                <p className="text-muted-foreground">
                  We will send you an email with a link to confirm your account
                </p>

                <div className="flex h-52 w-full items-center justify-center bg-neutral-700">
                  add graphic
                </div>
              </article>

              <article className="!border-r-0 border-b">
                <Badge variant="secondary">2</Badge>

                <h3 className="text-lg font-medium">Create your own page</h3>
                <p className="text-muted-foreground">
                  You can add your own content and customize your page
                </p>

                <div className="flex h-52 w-full items-center justify-center bg-neutral-700">
                  add graphic
                </div>
              </article>

              <article className="border-b">
                <Badge variant="secondary">3</Badge>

                <h3 className="text-lg font-medium">Add your contact information</h3>
                <p className="text-muted-foreground">
                  Anything you want to share with your contacts
                </p>

                <div className="flex h-52 w-full items-center justify-center bg-neutral-700">
                  add graphic
                </div>
              </article>

              <article className="!border-r-0 border-b">
                <Badge variant="secondary">4</Badge>

                <h3 className="text-lg font-medium">Purchase an NFC card</h3>
                <p className="text-muted-foreground">Choose from a variety of options</p>

                <div className="flex h-52 w-full items-center justify-center bg-neutral-700">
                  add graphic
                </div>
              </article>

              <article>
                <Badge variant="secondary">5</Badge>

                <h3 className="text-lg font-medium">Wait for it to arrive (5 days max)</h3>
                <p className="text-muted-foreground">Easy shipping</p>

                <div className="flex h-52 w-full items-center justify-center bg-neutral-700">
                  add graphic
                </div>
              </article>

              <article className="border-none">
                <Badge variant="secondary">6</Badge>

                <h3 className="text-lg font-medium">Use it anywhere!</h3>
                <p className="text-muted-foreground">No need to install anything</p>

                <div className="flex h-52 w-full items-center justify-center bg-neutral-700">
                  add graphic
                </div>
              </article>
            </div>
          </section>
        </div>

        <section id="security" className="mx-auto w-full max-w-6xl p-10">
          <header className="space-y-2">
            <h2 className="text-4xl font-medium">Keep your data safe</h2>

            <HyperText
              duration={50}
              className="text-muted-foreground"
              text="All contact information is encrypted to prevent unwanted access"
            />
          </header>
        </section>

        <footer className="mt-20 justify-end rounded-t-[32px] bg-gradient-to-t from-neutral-950 to-neutral-700 px-4 py-10 text-center text-neutral-400 shadow-xl md:px-10">
          <div className="flex items-center justify-center gap-2">
            <p>A project by </p>

            <Link
              target="_blank"
              className="flex items-center gap-2 underline-offset-2 transition-all hover:text-indigo-300 hover:underline"
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
