import { NextResponse } from "next/server";

export async function middleware(request) {
  const adminToken = request.cookies.get("adminToken");

  // If the token is not present, redirect to login page
  if (!adminToken) {
    const loginUrl = new URL("/api/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Proceed to the requested route
  return NextResponse.next();
}

// Apply middleware only to routes under `(admin)`
export const config = {
  matcher: ["/(admin)/:path*"],
};
