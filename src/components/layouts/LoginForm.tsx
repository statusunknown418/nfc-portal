"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Spinner } from "~/components/shared/Spinner";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { UrlObject } from "url";

const loginSchema = z.object({
  email: z
    .string()
    .email({
      message: "A valid email address is required",
    })
    .trim()
    .optional(),
  username: z.string().trim().optional(),
});

export const LoginForm = () => {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    // await signIn("resend", {
    //   callbackUrl: "/admin",
    //   email: data.email,
    // });
  });

  return (
    <Form {...form}>
      <form className="grid grid-cols-1 gap-6" method="POST" onSubmit={handleSubmit}>
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
                  autoComplete="email"
                  disabled={form.formState.isSubmitting}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button variant="link" className="-mt-4" asChild>
          <Link
            href={{
              pathname: "/auth/sign-up",
            }}
          >
            Create an account <ArrowRightIcon />
          </Link>
        </Button>

        <Button className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting && <Spinner className="mr-2" />}
          Continue
        </Button>
      </form>
    </Form>
  );
};
