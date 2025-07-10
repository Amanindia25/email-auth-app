import { connectDB } from "@/lib/db";

export async function GET() {
  try {
    await connectDB();
    return new Response("✅ MongoDB Connected Successfully!", { status: 200 });
  } catch (error) {
    return new Response("❌ DB Error: " + error.message, { status: 500 });
  }
}
