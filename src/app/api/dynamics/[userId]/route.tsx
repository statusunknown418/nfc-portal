import { eq } from "drizzle-orm";
import { ImageResponse } from "next/og";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";

export async function GET(
  request: Request,
  {
    params: { userId },
  }: {
    params: { userId: string };
  },
) {
  try {
    const data = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: {
        id: true,
        name: true,
        image: true,
        contactJSON: true,
      },
    });

    if (!data) {
      return new ImageResponse(
        (
          <div
            style={{
              height: "100%",
              width: "100%",
              backgroundColor: "black",
              color: "white",
            }}
          >
            <section className="flex flex-col items-center justify-center gap-4">
              <p className="text-red-500">Error</p>
              <h1>🥲 User not found</h1>
            </section>
          </div>
        ),
        {
          debug: true,
          width: 300,
          height: 160,
          status: 404,
        },
      );
    }

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            flexWrap: "nowrap",
          }}
        >
          {data.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img alt="profile-picture" width={50} height={50} src={data.image} title="profile" />
          )}

          {data.contactJSON?.jobTitle && (
            <span
              style={{
                color: "gray",
              }}
            >
              {data.contactJSON?.jobTitle}
            </span>
          )}
          {data.contactJSON?.company?.name && (
            <span
              style={{
                color: "gray",
              }}
            >
              {data.contactJSON.company?.name}
            </span>
          )}

          <span
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
            }}
          >
            {data.name}
          </span>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "3px",
              fontSize: "0.9rem",
              alignItems: "center",
            }}
          >
            {data.contactJSON?.email?.map((email) => (
              <a
                key={email.link}
                href={`mailto:${email.link}`}
                style={{
                  color: "#818cf8",
                }}
              >
                {email.link}
              </a>
            ))}
          </div>
        </div>
      ),
      {
        width: 400,
        height: 300,
      },
    );
  } catch (e: unknown) {
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
