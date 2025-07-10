// src/app/api/auth/logout/route.js

import { NextResponse } from "next/server";

export async function GET() {
  // Clear the 'token' cookie by setting it to expire
  const response = NextResponse.json({ message: "Logged out successfully" });

  response.cookies.set("token", "", {
    httpOnly: true,
    expires: new Date(0), // expired
  });

  return response;
}
