import { UserButton } from "@clerk/nextjs";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import Image from "next/image";
import Link from "next/link";
import { extractRouterConfig } from "uploadthing/server";
import { ForwardRewindButtons } from "~/components/onboarding/ForwardRewindButtons";
import { Stepper } from "~/components/onboarding/Stepper";
import { Button } from "~/components/ui/button";
import { uploadThingRouter } from "~/server/api/routers/upload-thing";

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="h-full overscroll-none">
      <NextSSRPlugin routerConfig={extractRouterConfig(uploadThingRouter)} />

      <nav className="sticky inset-0 z-20 flex justify-between gap-2 border-b bg-white p-4 py-1">
        <Button asChild variant="unstyled" className="items-center p-1 text-base">
          <Link href={"/onboarding/start"}>
            <Image
              src="/logo-light.png"
              alt="concard-logo"
              width={34}
              height={34}
              className="rounded-md"
            />
            ConCard
          </Link>
        </Button>

        <UserButton />
      </nav>

      <div className="relative flex w-full max-w-[1500px] flex-col gap-8 overflow-auto py-4 md:py-6">
        <Stepper />

        <section className="mx-auto w-full max-w-6xl px-2 md:px-0 md:py-6">{children}</section>

        <ForwardRewindButtons />
      </div>
    </main>
  );
}
