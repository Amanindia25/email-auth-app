"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function SignInPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ Redirect to home after successful login
        router.push("/home");
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Something went wrong!");
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center container mx-auto">
      <form
        onSubmit={handleSubmit}
        className="max-w-md w-full bg-white shadow-md p-6 rounded-lg"
      >
        <h2 className="text-xl font-semibold mb-4 text-center">Sign In</h2>

        <Input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full p-2 border mb-4"
          required
        />

        <Input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full p-2 border mb-4"
          required
        />

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <Button type="submit" className="w-full">
          Sign In
        </Button>
        <div className="text-sm text-center text-gray-600">
          Don&#39;t have an account?{" "}
          <Link href="/signup" className="text-blue-500 hover:underline">
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
}
