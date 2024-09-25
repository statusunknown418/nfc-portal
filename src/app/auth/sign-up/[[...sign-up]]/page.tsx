"use client";

import { SignUp } from "@clerk/nextjs";
import Particles from "~/components/magicui/particles";

export default function SignUpPage() {
  return (
    <div className="relative flex h-full w-full items-center justify-center px-4">
      <SignUp
        appearance={{
          elements: {
            rootBox: "w-full max-w-lg",
            cardBox: "w-full rounded-[calc(var(--radius)+1rem)]",
          },
          variables: {
            fontSize: "1rem",
          },
        }}
      />

      <Particles
        className="absolute inset-0 -z-10"
        quantity={200}
        ease={40}
        color="#000000"
        refresh
      />
    </div>
  );
}
