import { Sidebar } from "~/components/layouts/Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex h-screen flex-col-reverse bg-muted/50 dark:bg-background md:flex-row">
      <Sidebar />

      <main className="mx-1 my-1 max-h-full flex-grow overflow-auto rounded-2xl border bg-background px-4 py-6 sm:mx-2 sm:my-2 sm:px-8 md:ml-0">
        {children}
      </main>
    </section>
  );
}
