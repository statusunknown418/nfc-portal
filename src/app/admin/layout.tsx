import { Sidebar } from "~/components/layouts/Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex h-full flex-col-reverse bg-muted/50 dark:bg-background md:flex-row">
      <Sidebar />

      <main className="mx-1 my-1 max-h-full flex-grow overflow-y-auto rounded-2xl border bg-background p-8 sm:mx-2 sm:my-2 md:ml-0">
        {children}
      </main>
    </section>
  );
}
