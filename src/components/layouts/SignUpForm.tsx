"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { DiscordLogoIcon } from "@radix-ui/react-icons";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { setDecidedUsername } from "../../lib/cookies.actions";
import { Spinner } from "../shared/Spinner";

const usernameRegex = /^[a-zA-Z0-9._]+$/;

export const signUpSchema = z.object({
  email: z.string().email({
    message: "A valid email address is required",
  }),
  username: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || (val.length >= 3 && usernameRegex.test(val)), {
      message:
        "Username must be at least 3 characters long and can only contain letters, numbers, dots, and underscores",
    })
    .transform((val) => (val ? `@${val.toLowerCase()}` : val)),
});

export default function SignUpForm({
  defaultValues,
}: {
  defaultValues?: z.infer<typeof signUpSchema>;
}) {
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: defaultValues ?? {
      email: "",
      username: "",
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    !!data.username && (await setDecidedUsername(data.username.toLowerCase()));

    await signIn("resend", {
      callbackUrl: "/admin",
      email: data.email,
    });
  });

  return (
    <Form {...form}>
      <form className="grid grid-cols-1 gap-6" method="POST" onSubmit={handleSubmit}>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-0 rounded-md shadow-lg shadow-indigo-100 transition-shadow duration-100 has-[input:focus]:shadow-indigo-400">
                <p className="flex h-[36px] w-56 items-center rounded-l-md border bg-primary px-3 text-sm tracking-wide text-primary-foreground">
                  https://nearu.tech/@
                </p>
                <FormControl>
                  <Input
                    {...field}
                    className="rounded-l-none border-l-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    placeholder="the.architect"
                    autoCapitalize="off"
                    autoCorrect="off"
                    autoComplete="off"
                    disabled={form.formState.isSubmitting}
                  />
                </FormControl>
              </div>

              <FormMessage />

              <FormDescription>Leave blank for a random username.</FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your email</FormLabel>

              <FormControl>
                <Input
                  {...field}
                  placeholder="the.architect@nearu.tech"
                  autoCapitalize="off"
                  autoCorrect="off"
                  disabled={form.formState.isSubmitting}
                />
              </FormControl>

              <FormMessage />

              <FormDescription>This will be used to log in to the admin panel.</FormDescription>
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <Button className="w-full rounded-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && <Spinner className="mr-2" />}
            Get magic link
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            By signing up, you agree to our terms and conditions.
          </p>
        </div>
      </form>
    </Form>
  );
}

export const SignInWithSocial = ({ provider }: { provider: "google" | "discord" }) => {
  return (
    <Button
      className="w-full rounded-full"
      variant="outline"
      onClick={() =>
        signIn(provider, {
          callbackUrl: "/admin",
        })
      }
    >
      {provider === "discord" && <DiscordLogoIcon className="mr-2 h-5 w-5 text-indigo-600" />}
      Sign in with {provider}
    </Button>
  );
};
