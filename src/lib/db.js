import mongoose from "mongoose";

export async function connectDB() {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "emailAuthDB", // Optional: You can change this
    });

    console.log("✅ MongoDB Connected:", connection.connection.host);
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    throw new Error("MongoDB Connection Failed");
  }
}
