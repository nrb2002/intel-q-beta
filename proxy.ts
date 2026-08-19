// proxy.ts

import { auth } from "@/lib/auth";

/*
 * Authentication proxy for legacy protected routes.
 *
 * Staff and admin authorization is handled explicitly
 * by their server-side layouts/API authorization helpers.
 *
 * Public customer routes must remain accessible without
 * authentication.
 */
export const proxy = auth;

export const config = {
  matcher: [
    "/dashboard/:path*",
  ],
};