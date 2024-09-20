import { ArrowRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import SignUpForm from "~/components/layouts/SignUpForm";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";

export default function SignUpPage() {
  return (
    <section className="grid h-screen grid-cols-1 lg:grid-cols-2">
      <article className="hidden border-r bg-muted/50 lg:block">
        <p className="sr-only">Graphic</p>
      </article>

      <article className="flex flex-col items-center justify-center bg-muted/50 p-2 dark:bg-background lg:bg-transparent lg:p-0 lg:pl-8">
        <Card className="w-full max-w-xl bg-transparent lg:border-none lg:shadow-none">
          <CardHeader>
            <CardTitle className="text-2xl">Start the journey</CardTitle>
            <CardDescription>Sign up or log into your account to continue.</CardDescription>
          </CardHeader>

          <CardContent>
            <SignUpForm />

            <Button variant="link" className="mt-4 w-full" asChild>
              <Link href="/auth/login">
                Have an account?
                <span className="flex items-center gap-1 text-indigo-600 underline">
                  Sign in <ArrowRightIcon />
                </span>
              </Link>
            </Button>
          </CardContent>
        </Card>
      </article>
    </section>
  );
}
