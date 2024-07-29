import { CheckCircledIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";

export default function VerifyPage() {
  return (
    <section className="grid h-screen place-items-center bg-muted/50">
      <Card className="max-w-lg border-dashed border-emerald-500 bg-background text-center">
        <CardHeader className="flex flex-col items-center justify-center">
          <CheckCircledIcon className="h-12 w-12 text-emerald-500" />
          <CardTitle className="text-2xl">An email is on its way!</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-2">
          <CardDescription>
            Check your inbox for a verification email from us, you just need to click the button to
            be redirected back to the admin page.
          </CardDescription>

          <p className="text-sm underline">
            If you don&apos;t see the email, please check your spam folder.
          </p>

          <Button className="mt-6 rounded-full" asChild>
            <Link href="/">Go back home</Link>
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
