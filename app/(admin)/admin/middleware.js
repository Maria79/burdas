import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";

export async function middleware(req) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.isAdmin) {
    return NextResponse.redirect(new URL("/", req.url)); // Redirect to homepage
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/(admin)(.*)"], // Apply middleware to admin routes
};
