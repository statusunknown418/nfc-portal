import { LoginForm } from "~/components/layouts/LoginForm";
import { SignInWithSocial } from "~/components/layouts/SignUpForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Divider } from "~/components/ui/separator";

export default async function LoginPage() {
  const commonRedirect = new FormData();
  commonRedirect.append("redirectTo", "/admin");

  return (
    <section className="grid h-screen grid-cols-1 lg:grid-cols-2">
      <article className="hidden border-r lg:block">
        <p className="sr-only">Graphic</p>
      </article>

      <article className="flex flex-col items-center justify-center bg-muted/50 p-2 shadow-lg dark:bg-background lg:bg-transparent lg:p-0 lg:pl-8">
        <Card className="w-full max-w-xl bg-transparent lg:border-none lg:shadow-none">
          <CardHeader>
            <CardTitle className="text-2xl">Welcome back!</CardTitle>
            <CardDescription>Log into your account to continue.</CardDescription>
          </CardHeader>

          <CardContent>
            <LoginForm />

            <Divider className="my-6">or</Divider>

            <div className="space-y-2">
              <SignInWithSocial provider="google" />
              <SignInWithSocial provider="discord" />
            </div>
          </CardContent>
        </Card>
      </article>
    </section>
  );
}
