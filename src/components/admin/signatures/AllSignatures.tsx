"use client";

import { api, type RouterOutputs } from "~/trpc/react";

export const AllSignatures = ({ initialData }: { initialData: RouterOutputs["vCard"]["get"] }) => {
  const [data, opts] = api.vCard.get.useSuspenseQuery(undefined, { initialData });

  return (
    <section className="flex h-full w-full flex-col items-center gap-4">
      <p>
        Here you can manage all your signatures, you can also import them from other places, this is
        useful for you to showcase more of your work.
      </p>
    </section>
  );
};
