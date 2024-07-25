import Link from "next/link";
import { Example } from "~/components/Example";
import { Button } from "~/components/ui/button";

import { auth } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";

export default async function Home() {
  const session = await auth();

  return (
    <HydrateClient>
      <div className="flex flex-col items-center justify-center gap-4">
        <p className="text-center text-white">
          {session && <span>Logged in as {JSON.stringify(session.user)}</span>}
        </p>

        <Button asChild>
          <Link href={session ? "/api/auth/signout" : "/api/auth/signin"}>
            {session ? "Sign out" : "Sign in"}
          </Link>
        </Button>

        <Example />
      </div>
    </HydrateClient>
  );
}
