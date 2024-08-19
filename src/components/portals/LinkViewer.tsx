import Image from "next/image";
import { cn } from "~/lib/utils";
import { type RouterOutputs } from "~/trpc/react";
import { Button } from "../ui/button";

export const LinkViewer = ({ link }: { link: RouterOutputs["links"]["all"][number] }) => {
  return (
    <button
      className={cn(
        "flex max-h-20 min-h-20 w-full items-center justify-between gap-10 border p-2 text-sm sm:text-base",
      )}
    >
      {!!link.thumbnail && (
        <Image
          src={link.thumbnail}
          alt={`link-thumbnail`}
          width={120}
          height={80}
          className="aspect-square h-16"
          sizes="(max-width: 768px) 128px, 200px"
        />
      )}

      <div className="col-span-2 flex flex-grow">{link.displayText}</div>

      <Button></Button>
    </button>
  );
};
