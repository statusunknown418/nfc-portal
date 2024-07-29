import { UpdateIcon } from "@radix-ui/react-icons";
import { cn } from "~/lib/utils";

export const Spinner = ({ className }: { className?: string }) => {
  return (
    <div role="status">
      <UpdateIcon className={cn("h-4 w-4 animate-spin text-indigo-500 duration-500", className)} />
      <span className="sr-only">Loading...</span>
    </div>
  );
};
