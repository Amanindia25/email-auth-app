import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifyToken: String,
    verifyTokenExpiry: Date, // 👈 used for 10-minute expiry
  },
  {
    timestamps: true, // auto adds createdAt and updatedAt
  }
);

// Prevent model overwrite during dev hot reload
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
