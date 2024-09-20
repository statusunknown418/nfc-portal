import { LoginForm } from "~/components/layouts/LoginForm";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";

export default async function LoginPage({
  searchParams: { error },
}: {
  searchParams: {
    error?: string;
  };
}) {
  const commonRedirect = new FormData();
  commonRedirect.append("redirectTo", "/admin");

  return (
    <section className="grid h-screen grid-cols-1 lg:grid-cols-2">
      <article className="hidden border-r lg:block">
        <p className="sr-only">Graphic</p>
      </article>

      <article className="flex flex-col items-center justify-center bg-muted/50 p-2 shadow-lg dark:bg-background lg:bg-transparent lg:p-0 lg:pl-8">
        <Card className="w-full max-w-xl bg-transparent lg:border-none lg:shadow-none">
          {error && (
            <div className="mt-4 px-6">
              <Alert variant="destructive">
                <AlertTitle className="text-base">Something went wrong</AlertTitle>
                <AlertDescription>Code: {error}</AlertDescription>
              </Alert>
            </div>
          )}
          <CardHeader>
            <CardTitle className="text-2xl">Welcome back!</CardTitle>
            <CardDescription>Log into your account to continue.</CardDescription>
          </CardHeader>

          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </article>
    </section>
  );
}
