// proxy.ts

import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";

export default auth((request) => {
  const { pathname } = request.nextUrl;
  const isAuthenticated = !!request.auth?.user;

  const isStaffRoute = pathname.startsWith("/staff");
  const isAdminRoute = pathname.startsWith("/admin");

  /*
   * Staff and admin areas require authentication.
   *
   * Role authorization is enforced again inside the
   * server components using requireStaff() / requireAdmin().
   */
  if ((isStaffRoute || isAdminRoute) && !isAuthenticated) {
    const loginPath = isAdminRoute
      ? "/login/admin"
      : "/login/staff";

    const loginUrl = new URL(loginPath, request.url);

    loginUrl.searchParams.set(
      "callbackUrl",
      pathname,
    );

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/staff/:path*",
    "/admin/:path*",
    "/api/staff/:path*",
    "/api/admin/:path*",
  ],
};