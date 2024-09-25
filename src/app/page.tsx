import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

import { HydrateClient } from "~/trpc/server";

export default async function Home() {
  const { sessionClaims } = auth();

  return (
    <HydrateClient>
      <div className="flex flex-col items-center justify-center gap-4">
        <p className="text-center">{JSON.stringify(sessionClaims)}</p>

        <SignedIn>
          <UserButton />
        </SignedIn>

        <SignedOut>
          <SignInButton />
        </SignedOut>

        <form>
          <h1>Get your username now!</h1>

          <Input name="username" placeholder="someone-cool" id="username" />

          <Button size="icon" className="h-12 w-12 rounded-full">
            <ArrowRightIcon className="h-6 w-6" />
          </Button>
        </form>
      </div>
    </HydrateClient>
  );
}
