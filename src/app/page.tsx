import Link from "next/link";
import { Example } from "~/components/Example";
import { Button } from "~/components/ui/button";
import { Divider } from "~/components/ui/separator";

import { auth } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";

export default async function Home() {
  const session = await auth();

  return (
    <HydrateClient>
      <div className="flex flex-col items-center justify-center gap-4">
        <p className="text-center">
          {session && <span>Logged in as {JSON.stringify(session.user)}</span>}
        </p>

        <Button asChild>
          <Link href={session ? "/api/auth/signout" : "/auth/login"}>
            {session ? "Sign out" : "Sign in"}
          </Link>
        </Button>

        <section className="flex max-w-prose flex-col gap-2">
          <p>Buy/sign in flow must be remade</p>
          <Divider />

          <h2 className="text-base font-bold">
            Initial distribution is (separate flows, logins, pages):
          </h2>
          <ol className="list-decimal">
            <li>Store = store.nearu.tech</li>
            <li>Landing = nearu.tech</li>
            <li>B2C Admin panel = nearu.tech/admin</li>
            <li>
              B2B Admin panel = companies.nearu.tech/admin OR nearu.tech/companies - should have
              separate sign in flow
            </li>
          </ol>
          <p>
            Could be merged into a single app by allowing users to optionally purchase the b2b
            subscription & create a workspace for them, from within the app itself
          </p>
          <h3 className="text-base font-bold">App distribution will then be like (single app):</h3>
          <ol className="list-decimal">
            <li>Store = store.nearu.tech</li>
            <li>Landing = nearu.tech</li>
            <li>B2C Admin panel = nearu.tech/admin/personal</li>
            <li>
              B2B Admin panel = nearu.tech/admin/meow.studios (where meow.studios =
              [companyIdentifier]) essentially a different username for workspaces
            </li>
          </ol>
          <Divider />
          <h3 className="text-base font-bold">Proposed (storefront flow):</h3>
          <ol className="list-decimal">
            <li>Starts on STOREFRONT</li>
            <li>Buys NFC card</li>
            <li>Enters email (& chooses username?) to be linked to the card</li>
            <li>[auto sign-in to the app]</li>
            <li>Redirected to ADMIN PANEL</li>
            <li>Stuff happens</li>
          </ol>
          <h3 className="text-base font-bold">Proposed (admin panel flow):</h3>
          <ol className="list-decimal">
            <li>Starts on ADMIN PANEL</li>
            <li>Signs in first time & chooses username</li>
            <li>Enters admin panel</li>
            <li>
              Show banner to say that the account is not linked to any card and they can get one to
              enhance the experience
            </li>
            <li>[BUY HERE] - redirects to storefront (without logging out)</li>
            <li>Redirected to STOREFRONT</li>
          </ol>
        </section>

        <Example />
      </div>
    </HydrateClient>
  );
}
