import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { cn } from "~/lib/utils";
import { type RouterOutputs } from "~/trpc/react";

export function EditLinkForm({
  className,
  link,
}: React.ComponentProps<"form"> & {
  link: RouterOutputs["links"]["all"][number];
}) {
  return (
    <form className={cn("grid items-start gap-4", className)}>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input type="email" id="email" defaultValue="shadcn@example.com" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="username">Username</Label>
        <Input id="username" defaultValue="@shadcn" />
      </div>
      <Button className="mt-4" type="submit">
        Save changes
      </Button>
    </form>
  );
}
