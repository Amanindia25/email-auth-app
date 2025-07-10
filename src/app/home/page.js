"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import jwt from "jsonwebtoken";

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
          router.push("/signin");
          return;
        }
        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        router.push("/signin");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Welcome {user?.email || "User"} 🎉</h1>
      <p className="text-gray-600 mt-2">
        You're logged in to a protected route.
      </p>
    </div>
  );
}
