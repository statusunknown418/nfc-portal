import { ExclamationTriangleIcon, ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "../ui/card";
import { auth } from "@clerk/nextjs/server";

export const NotFound = async () => {
  const { sessionClaims } = auth();

  return (
    <main className="grid h-svh grid-cols-1 place-items-center bg-muted/50 p-4 dark:bg-background md:p-0">
      <Card className="max-w-sm text-center dark:bg-muted/20">
        <CardHeader>
          <ExclamationTriangleIcon className="h-9 w-9 self-center text-destructive" />
          <CardTitle className="text-xl md:text-2xl">Username not found</CardTitle>
          <CardDescription>
            Try approaching the NFC card again or double check the URL.
          </CardDescription>
        </CardHeader>

        <CardFooter className="flex flex-col gap-3">
          <Button className="w-full rounded-full" asChild>
            <Link href="/">
              <ArrowLeftIcon className="mr-2" />
              Go back home
            </Link>
          </Button>

          {sessionClaims?.username && (
            <Button variant="outline" className="w-full rounded-full" asChild>
              <Link href="/admin">
                To the admin panel <ArrowRightIcon className="ml-2" />
              </Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    </main>
  );
};
