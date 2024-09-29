import { ImageResponse } from "next/og";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const hasName = searchParams.has("name");
    const title = hasName ? searchParams.get("name") : "Somebody";
    const imageUrl = searchParams.get("image");

    const emails = searchParams.getAll("email").toString().split(",");
    const phones = searchParams.getAll("phone");

    return new ImageResponse(
      (
        <div
          style={{
            backgroundColor: "black",
            backgroundSize: "150px 150px",
            height: "100%",
            width: "100%",
            display: "flex",
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            flexWrap: "nowrap",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              justifyItems: "center",
            }}
          >
            <img
              alt="Photo URL"
              height={100}
              width={100}
              style={{ margin: "0 30px" }}
              src={
                imageUrl ??
                "data:image/svg+xml,%3Csvg width='116' height='100' fill='white' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M57.5 0L115 100H0L57.5 0z' /%3E%3C/svg%3E"
              }
            />
          </div>

          <div
            style={{
              fontSize: 60,
              fontStyle: "normal",
              letterSpacing: "-0.025em",
              color: "white",
              marginTop: 30,
              padding: "0 120px",
              lineHeight: 1.4,
              whiteSpace: "pre-wrap",
            }}
          >
            {title}
          </div>

          {emails.map((email, idx) => (
            <div
              key={idx}
              style={{
                fontSize: 20,
                fontStyle: "normal",
                letterSpacing: "-0.025em",
                color: "white",
                marginTop: 30,
                padding: "0 120px",
                lineHeight: 1.4,
                whiteSpace: "pre-wrap",
              }}
            >
              {email}
            </div>
          ))}

          {phones.map((phone, idx) => (
            <div
              key={idx}
              style={{
                fontSize: 20,
                fontStyle: "normal",
                letterSpacing: "-0.025em",
                color: "white",
                marginTop: 30,
                padding: "0 120px",
                lineHeight: 1.4,
                whiteSpace: "pre-wrap",
              }}
            >
              {phone}
            </div>
          ))}
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (e: unknown) {
    console.log(`${(e as Error).message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
