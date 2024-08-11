import { Sidebar } from "~/components/layouts/Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="mx-auto flex h-screen flex-col-reverse dark:bg-background md:flex-row">
      <Sidebar />

      <main className="relative flex-grow overflow-y-auto px-4 py-6 sm:px-8 md:ml-0 lg:px-14">
        {children}
      </main>
    </section>
  );
}
