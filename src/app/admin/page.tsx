import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { auth } from "~/server/auth";
import { api } from "~/trpc/server";

const seeds = [
  {
    id: "1",
    name: "NearU.tech",
    url: "https://nearu.tech",
    image: "https://nearu.tech/logo.png",
  },
  {
    id: "2",
    name: "NearU.tech",
    url: "https://nearu.tech",
    image: "https://nearu.tech/logo.png",
  },
  {
    id: "3",
    name: "NearU.tech",
    url: "https://nearu.tech",
    image: "https://nearu.tech/logo.png",
  },
  {
    id: "4",
    name: "NearU.tech",
    url: "https://nearu.tech",
    image: "https://nearu.tech/logo.png",
  },
  {
    id: "5",
    name: "NFC Portal",
    url: "https://nfc-portal.vercel.app",
    image: "https://nfc-portal.vercel.app/opengraph-image.png",
  },
  {
    id: "6",
    name: "NFC Portal",
    url: "https://nfc-portal.vercel.app",
    image: "https://nfc-portal.vercel.app/opengraph-image.png",
  },
  {
    id: "7",
    name: "NFC Portal",
    url: "https://nfc-portal.vercel.app",
    image: "https://nfc-portal.vercel.app/opengraph-image.png",
  },
  {
    id: "8",
    name: "NFC Portal",
    url: "https://nfc-portal.vercel.app",
    image: "https://nfc-portal.vercel.app/opengraph-image.png",
  },
  {
    id: "9",
    name: "NFC Portal",
    url: "https://nfc-portal.vercel.app",
    image: "https://nfc-portal.vercel.app/opengraph-image.png",
  },
  {
    id: "10",
    name: "NFC Portal",
    url: "https://nfc-portal.vercel.app",
    image: "https://nfc-portal.vercel.app/opengraph-image.png",
  },
];

export default async function AdminPage() {
  const session = await api.viewer.get();
  const jwt = await auth();

  if (!session) {
    return (
      <section>
        <h1>Something weird happened...</h1>
        <p>
          Looks like we were unable to recognize you. Please <a href="/auth/login">login</a> again.
        </p>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-10 md:flex-row">
      <article className="flex h-full flex-grow flex-col gap-6">
        <article>
          <h1 className="text-xl font-bold">Welcome {jwt?.user.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Here you can manage everything that shows up on your NFC portal page.
          </p>
        </article>

        <article className="flex flex-grow flex-col gap-4">
          {seeds.map((seed) => (
            <Card key={seed.id}>
              <CardHeader>
                <CardTitle>{seed.name}</CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-sm text-muted-foreground">{seed.url}</p>
              </CardContent>
            </Card>
          ))}
        </article>
      </article>

      <article className="inset-0 hidden h-[calc(100vh-82px)] min-w-[400px] max-w-[400px] rounded-2xl border p-6 shadow-md ring-0 md:sticky md:block">
        <div></div>
        <h3 className="text-muted-foreground">Preview</h3>
      </article>
    </section>
  );
}
