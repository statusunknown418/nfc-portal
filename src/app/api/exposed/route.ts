import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const body = (await req.json()) as { data: string | number; key: string; type: "read" | "write" };

  if (!body.type) {
    return NextResponse.json({ success: false, error: "type_required" });
  }

  if (body.type === "read") {
    return NextResponse.json({ success: true, data: cookies().get(body.key)?.value ?? 0 });
  }

  if (!body.key) {
    return NextResponse.json({ success: false, error: "key_required" });
  }

  if (!body.data) {
    return NextResponse.json({ success: false, error: "data_required" });
  }

  cookies().set(body.key, body.data.toString());

  return NextResponse.json({ success: true, data: body.data });
};
