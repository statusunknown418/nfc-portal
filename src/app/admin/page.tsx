import { redirect } from "next/navigation";
import { SignOut } from "~/components/shared/SignOut";
import { auth } from "~/server/auth";

export default async function AdminPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <section>
      <h1>Admin page</h1>

      <SignOut />

      <p>You are signed in as {session.user.name}</p>
    </section>
  );
}
