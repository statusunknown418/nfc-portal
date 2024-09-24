import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

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
      </div>
    </HydrateClient>
  );
}
