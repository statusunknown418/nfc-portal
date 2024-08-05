"use client";

import { type ContactVCardType } from "~/server/db/schema";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export const ContactInfo = ({
  unlocked,
  data,
}: {
  unlocked?: boolean;
  data: ContactVCardType | null;
}) => {
  if (!unlocked) {
    return (
      <Card className="relative border-2 border-dashed">
        <section className="absolute inset-0 flex h-full w-full flex-col items-center justify-center gap-1 rounded-lg bg-background/50 p-6 backdrop-blur backdrop-filter">
          <h3>🔒 Contact info is locked.</h3>
          <p className="text-sm text-muted-foreground">
            This is automatically unlocked when the owner&apos;s NFC card is scanned.
          </p>
        </section>
        <CardHeader>
          <CardTitle>Contact</CardTitle>
        </CardHeader>

        <CardContent>What are you looking for huh?</CardContent>
      </Card>
    );
  }

  return (
    <div className="rounded-lg border p-6">
      <h3>Contact info</h3>
      🔓 SENSITIVE INFO UNLOCKED
      <p>
        {data?.name.first} {data?.name.last}
      </p>
    </div>
  );
};
