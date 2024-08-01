import { Sidebar } from "~/components/layouts/Sidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex h-full bg-muted/50 dark:bg-background">
      <Sidebar />

      <main className="my-2 mr-2 flex-grow overflow-y-auto rounded-2xl border bg-background p-8">
        {children}
      </main>
    </section>
  );
}
