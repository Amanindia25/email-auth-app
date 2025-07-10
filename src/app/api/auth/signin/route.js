import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectDB();

  try {
    const { email, password } = await req.json();

    // 🔍 Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    // 🛑 Check if email is verified
    if (!user.isVerified) {
      return Response.json(
        { error: "Please verify your email first." },
        { status: 403 }
      );
    }

    // 🔐 Compare entered password with saved hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return Response.json({ error: "Invalid password" }, { status: 401 });
    }

    // ✅ Success
    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Set JWT as HTTP-only cookie
    const response = NextResponse.json({ message: "Login successful" });
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60, // 1 hour
      path: "/",
    });
    return response;
  } catch (error) {
    console.error("Signin error:", error);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
