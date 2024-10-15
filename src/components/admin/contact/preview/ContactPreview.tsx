"use client";

import { api, type RouterOutputs } from "~/trpc/react";

export const ContactPreview = ({ initialData }: { initialData: RouterOutputs["vCard"]["get"] }) => {
  const { data } = api.vCard.get.useQuery(undefined, { initialData });

  return (
    <section className="flex flex-col gap-4">
      <h3>Contact preview</h3>

      <article className="w-full rounded-xl border">
        <header className="flex items-center justify-between p-4">
          <h4 className="text-xl font-semibold">
            {data?.contactJSON?.name.first} {data?.contactJSON?.name.last}
          </h4>

          <p className="text-sm text-muted-foreground">{data?.contactJSON?.jobTitle}</p>
        </header>
      </article>
    </section>
  );
};
