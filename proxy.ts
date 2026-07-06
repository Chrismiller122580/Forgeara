import { NextResponse } from "next/server";
import { getAuth0 } from "./lib/auth0";
import { isAuth0Configured } from "./lib/auth/env";

export async function proxy(request: Request) {
  if (!isAuth0Configured()) {
    const { pathname } = new URL(request.url);
    if (pathname.startsWith("/auth/")) {
      return NextResponse.json(
        {
          error:
            "Auth0 is not configured. Add AUTH0_DOMAIN, AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET, AUTH0_SECRET, and APP_BASE_URL in Vercel environment variables, then redeploy.",
        },
        { status: 503 }
      );
    }
    return NextResponse.next();
  }

  const auth0 = getAuth0();
  if (!auth0) {
    const { pathname } = new URL(request.url);
    if (pathname.startsWith("/auth/")) {
      return NextResponse.json(
        {
          error:
            "Auth0 failed to initialize. Set AUTH0_DOMAIN to hostname only (e.g. your-tenant.us.auth0.com), verify AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET, AUTH0_SECRET, and set APP_BASE_URL=https://www.forgeara.com, then redeploy.",
        },
        { status: 503 }
      );
    }
    return NextResponse.next();
  }
  return await auth0.middleware(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|demo-vehicle.jpg).*)",
  ],
};