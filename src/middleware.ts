import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/admin(.*)", "/business", "/onboarding(.*)"]);

export default clerkMiddleware((auth, req) => {
  const headers = new Headers(req.headers);
  const nextUrl = req.nextUrl;

  if (isProtectedRoute(req)) {
    auth().protect();
  }

  // if (!req.nextUrl.searchParams.has(PORTAL_QUERY)) {
  //   return NextResponse.next({ headers });
  // }

  // const portalPassword = req.nextUrl.searchParams.get(PORTAL_QUERY);
  // headers.set("set-cookie", `${PORTAL_KEY}=${portalPassword}; SameSite=Strict; HttpOnly`);

  // nextUrl.searchParams.delete(PORTAL_QUERY);

  return NextResponse.redirect(nextUrl, {
    headers,
  });
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
