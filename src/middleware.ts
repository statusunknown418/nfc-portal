import { NextResponse } from "next/server";
import { auth } from "./server/auth";

export default auth(async function middleware(req, _ctx) {
  if (req.auth) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/auth/login", req.url));
});

export const config = {
  matcher: ["/admin/:path*", "/business/:path*"],
};
