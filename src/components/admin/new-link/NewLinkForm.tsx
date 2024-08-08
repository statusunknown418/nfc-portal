"use client";

import { useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";

export function NewLinkForm({ className }: { className?: string }) {
  const form = useForm();

  return (
    <Form {...form}>
      <form className={cn("grid items-start gap-4", className)}>
        <FormField
          name="displayText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>

              <FormControl>
                <Input placeholder="My website" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Links to</FormLabel>

              <FormControl>
                <Input placeholder="https://example.com" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <Button size="lg" className="mt-4">
          Add it!
        </Button>
      </form>
    </Form>
  );
}
