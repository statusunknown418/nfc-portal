import { UserButton } from "@clerk/nextjs";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import Image from "next/image";
import Link from "next/link";
import { extractRouterConfig } from "uploadthing/server";
import { ForwardRewindButtons } from "~/components/onboarding/ForwardRewindButtons";
import { Stepper } from "~/components/onboarding/Stepper";
import { LocaleSwitcherWrapper } from "~/components/shared/locale-switcher";
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

        <div className="flex items-center gap-4">
          <LocaleSwitcherWrapper />

          <UserButton />
        </div>
      </nav>

      <div className="relative mx-auto flex w-full max-w-[1500px] flex-col items-center gap-8 overflow-auto py-4 md:py-6">
        <Stepper />

        <section className="w-full max-w-7xl px-4 md:px-0 md:py-6">{children}</section>

        <ForwardRewindButtons />
      </div>
    </main>
  );
}
