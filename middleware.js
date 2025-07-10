import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// Define protected routes
const protectedRoutes = ["/home"];

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // If route is not protected, continue
  if (!protectedRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Get token from cookies
  const token = request.cookies.get("token")?.value;

  // If no token, redirect to /signin
  if (!token) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  try {
    // Verify token using JWT_SECRET
    jwt.verify(token, process.env.JWT_SECRET);
    return NextResponse.next();
  } catch (error) {
    // If token invalid, redirect to /signin
    return NextResponse.redirect(new URL("/signin", request.url));
  }
}
