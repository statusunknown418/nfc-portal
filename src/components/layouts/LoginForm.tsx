"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
import { Spinner } from "../shared/Spinner";

const loginSchema = z.object({
  email: z.string().email(),
});

export default function LoginForm() {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    await signIn("resend", {
      callbackUrl: "/admin",
      email: data.email,
    });
  });

  return (
    <Form {...form}>
      <form
        className="grid grid-cols-1 gap-8"
        method="POST"
        action="/api/auth/signin/email"
        onSubmit={handleSubmit}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>

              <FormControl>
                <Input
                  {...field}
                  placeholder="the.architect@nearu.tech"
                  disabled={form.formState.isSubmitting}
                />
              </FormControl>

              <FormMessage />

              <FormDescription>
                Use the same email you registered when getting your custom NFC card and get a magic
                link to enter the admin panel.
              </FormDescription>
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
