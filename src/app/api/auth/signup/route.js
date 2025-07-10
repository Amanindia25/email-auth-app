// import { connectDB } from "@/lib/db";
// import User from "@/models/User";
// import bcrypt from "bcryptjs";
// import { NextResponse } from "next/server";
// import crypto from "crypto";
// import { sendVerificationEmail } from "@/lib/mailer";

// export async function POST(req) {
//   await connectDB();

//   try {
//     const { name, email, password } = await req.json();

//     // 🔍 Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return NextResponse.json(
//         { error: "User already exists" },
//         { status: 400 }
//       );
//     }

//     // 🔐 Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // 🔐 Generate token for email verification
//     const verifyToken = crypto.randomBytes(32).toString("hex");
//     const verifyTokenExpiry = Date.now() + 10 * 60 * 1000; // 10 mins

//     // 📝 Create new user
//     const user = new User({
//       name,
//       email,
//       password: hashedPassword,
//       verifyToken,
//       verifyTokenExpiry,
//     });

//     await user.save();

//     // 📨 Email sending will be added here (Nodemailer)

//     await sendVerificationEmail({
//       email,
//       username: name,
//       verifyToken,
//     });
//     // 👇 NEXT STEP:
//     // Send email to user.email with verifyToken

//     return NextResponse.json(
//       { message: "User created. Please verify your email." },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Signup error:", error);
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }

//-------------------

import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { sendVerificationEmail } from "@/lib/mailer";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (!existingUser.isVerified) {
        // Resend verification email with new token
        const verifyToken = crypto.randomBytes(32).toString("hex");
        existingUser.verifyToken = verifyToken;
        existingUser.verifyTokenExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
        await existingUser.save();
        await sendVerificationEmail({
          email,
          username: existingUser.name,
          verifyToken,
        });
        return NextResponse.json({
          message:
            "Account already registered but not verified. Verification link sent again. Please check your email.",
        });
      }
      // Already verified
      return NextResponse.json(
        { error: "User already exists and is verified. Please sign in." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verifyToken = crypto.randomBytes(32).toString("hex");

    const user = new User({
      name,
      email,
      password: hashedPassword,
      verifyToken,
      verifyTokenExpiry: Date.now() + 10 * 60 * 1000, // 10 minutes
    });

    await user.save();

    await sendVerificationEmail({
      email,
      username: name,
      verifyToken,
    });

    return NextResponse.json({
      message: "User registered! Please verify your email.",
    });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
