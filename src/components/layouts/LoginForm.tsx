"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Spinner } from "~/components/shared/Spinner";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";

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
    await signIn("resend", {
      callbackUrl: "/admin",
      email: data.email,
    });
  });

  return (
    <Form {...form}>
      <form className="grid grid-cols-1 gap-6" method="POST" onSubmit={handleSubmit}>
        {/* <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your username</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="@the.architect"
                  disabled={form.formState.isSubmitting}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Divider className="my-0">or</Divider> */}

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
                  disabled={form.formState.isSubmitting}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button variant="link" className="-mt-4" asChild>
          <Link href="/auth/signup">
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
