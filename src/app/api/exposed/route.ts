import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { type z } from "zod";
import { type loginSchema } from "~/components/layouts/LoginForm";

export const POST = async (req: NextRequest) => {
  const body = (await req.json()) as z.infer<typeof loginSchema>;

  if (!body.username) {
    return NextResponse.json({ success: false, error: "username_required" });
  }

  cookies().set("decided-username", body.username?.toString());

  return NextResponse.json({ success: true });
};
