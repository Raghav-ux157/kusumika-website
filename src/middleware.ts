import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  verifyStaffSessionToken,
  isRouteAllowedForRole,
} from "@/lib/auth/adminAuth";

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // 1. Skip login and public auth endpoints
  if (
    pathname === "/admin/login" ||
    pathname === "/api/admin/login" ||
    pathname === "/api/admin/logout"
  ) {
    // If user is already authenticated and visits /admin/login, redirect them directly to /admin
    if (pathname === "/admin/login") {
      const sessionCookie = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
      const session = await verifyStaffSessionToken(sessionCookie);
      if (session) {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
    }
    return NextResponse.next();
  }

  // 2. Only intercept /admin and /api/admin routes
  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");

  if (!isAdminPage && !isAdminApi) {
    return NextResponse.next();
  }

  // 3. Inspect Session Cookie
  const sessionCookie = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const session = await verifyStaffSessionToken(sessionCookie);

  // 4. Handle Unauthenticated Requests
  if (!session) {
    if (isAdminApi) {
      return NextResponse.json(
        { error: "Unauthorized. Atelier staff authentication required." },
        { status: 401 }
      );
    }

    // Redirect to login with original target preserved
    const redirectUrl = new URL("/admin/login", req.url);
    const destination = `${pathname}${search || ""}`;
    redirectUrl.searchParams.set("redirect", destination);

    // If cookie existed but was expired, add notification query
    if (sessionCookie) {
      redirectUrl.searchParams.set("session_expired", "1");
    }

    return NextResponse.redirect(redirectUrl);
  }

  // 5. Server-Side Role-Based Access Control (RBAC)
  const allowed = isRouteAllowedForRole(pathname, session.role);

  if (!allowed) {
    if (isAdminApi) {
      return NextResponse.json(
        {
          error: `Forbidden. Role '${session.role}' is not authorized for this resource.`,
        },
        { status: 403 }
      );
    }

    // Redirect to overview with 403 unauthorized notification
    const unauthorizedUrl = new URL("/admin", req.url);
    unauthorizedUrl.searchParams.set("error", "unauthorized");
    unauthorizedUrl.searchParams.set("attempted", pathname);

    return NextResponse.redirect(unauthorizedUrl);
  }

  // 6. Authorized: Forward request with staff identity headers
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-staff-id", session.userId);
  requestHeaders.set("x-staff-email", session.email);
  requestHeaders.set("x-staff-role", session.role);
  requestHeaders.set("x-staff-name", session.fullName);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
  ],
};
