import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { uploadThingRouter } from "~/server/api/routers/upload-thing";

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex h-full items-center justify-center p-2 sm:p-4 md:p-6 2xl:p-12">
      <div className="flex h-full w-full max-w-[1500px] overflow-auto rounded-[calc(var(--radius)+0.7rem)] border shadow-xl">
        {children}
      </div>

      <NextSSRPlugin routerConfig={extractRouterConfig(uploadThingRouter)} />
    </main>
  );
}
