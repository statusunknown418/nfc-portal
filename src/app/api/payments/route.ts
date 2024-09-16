import { NextResponse, type NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  const body = (await req.json()) as Record<string, unknown>;

  return NextResponse.json({ listened: true, body });
};
