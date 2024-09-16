import { NextResponse } from "next/server";
import { auth } from "./server/auth";

export const PORTAL_KEY = "portal-password";
export const PORTAL_QUERY = "ktp";
export const INCOMING_URL = "x-current-url";

const secure_routes = ["/admin", "/business", "/onboarding"];

export default auth(async function middleware(req, _ctx) {
  const headers = new Headers(req.headers);
  headers.set(INCOMING_URL, req.nextUrl.pathname);

  if (secure_routes.includes(req.nextUrl.pathname)) {
    if (req.auth) {
      return NextResponse.next({ headers });
    } else {
      return NextResponse.redirect(new URL("/auth/login", req.url), {
        headers,
      });
    }
  }

  if (!req.nextUrl.searchParams.has(PORTAL_QUERY)) {
    return NextResponse.next({ headers });
  }

  const portalPassword = req.nextUrl.searchParams.get(PORTAL_QUERY);
  headers.set("set-cookie", `${PORTAL_KEY}=${portalPassword}; SameSite=Strict; HttpOnly`);

  const nextUrl = req.nextUrl;
  nextUrl.searchParams.delete(PORTAL_QUERY);

  return NextResponse.redirect(nextUrl, {
    headers,
  });
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
