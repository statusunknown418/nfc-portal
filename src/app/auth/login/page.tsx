import LoginForm from "~/components/layouts/LoginForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export default async function LoginPage() {
  return (
    <section className="grid h-screen grid-cols-1 lg:grid-cols-2">
      <article className="hidden border-r bg-muted/50 lg:block">
        <p className="sr-only">Graphic</p>
      </article>

      <article className="flex flex-col items-center justify-center bg-muted/50 p-2 dark:bg-background lg:bg-transparent lg:p-0 lg:pl-8">
        <Card className="w-full max-w-lg dark:bg-muted/20 lg:border-none lg:shadow-none">
          <CardHeader>
            <CardTitle className="text-2xl">Start the journey</CardTitle>
            <CardDescription>
              Sign up or log into your account to continue.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </article>
    </section>
  );
}
