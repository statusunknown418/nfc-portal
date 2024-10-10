import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { Sidebar } from "~/components/layouts/Sidebar";
import { uploadThingRouter } from "~/server/api/routers/upload-thing";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex h-full max-h-full flex-1 flex-col dark:bg-background">
      <Sidebar />

      <main className="flex flex-1 flex-col items-center overflow-y-auto py-8">
        <section className="w-full max-w-[1400px] px-4">{children}</section>
      </main>

      <NextSSRPlugin routerConfig={extractRouterConfig(uploadThingRouter)} />
    </section>
  );
}
