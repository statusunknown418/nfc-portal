import { ContactInfo } from "~/components/portals/ContactInfo";
import { api } from "~/trpc/server";

export default async function UsernamePage({
  params,
}: {
  searchParams: { ktp?: string };
  params: { username: string };
}) {
  const username = decodeURIComponent(params.username);
  const portal = await api.portals.get({ username });

  if (!portal.data) {
    return <div>User not found</div>;
  }

  return (
    <div>
      <h1>{username} custom page</h1>

      <code>{JSON.stringify(portal.data, null, 2)}</code>

      <ContactInfo unlocked={portal.unlocked} />
    </div>
  );
}
