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
    <section className="flex flex-col gap-4 md:gap-8 lg:flex-row">
      <article className="flex h-full flex-grow flex-col items-center gap-6">
        <article className="w-full max-w-prose">
          <h1 className="text-xl font-bold">Welcome {jwt?.user.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Here you can manage everything that shows up on your NFC portal page.
          </p>
        </article>

        <article className="flex w-full flex-grow flex-col gap-4 md:max-w-prose">
          {seeds.map((seed) => (
            <div key={seed.id} className="flex w-full items-center">
              <Card className="flex-grow">
                <CardHeader>
                  <CardTitle>{seed.name}</CardTitle>
                </CardHeader>

                <CardContent>
                  <p className="text-sm text-muted-foreground">{seed.url}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </article>
      </article>

      <article className="inset-0 hidden h-[calc(100vh-82px)] min-w-[400px] max-w-[400px] rounded-2xl border p-6 shadow-md ring-0 lg:sticky lg:block">
        <div></div>
        <h3 className="text-muted-foreground">Preview</h3>
      </article>
    </section>
  );
}
