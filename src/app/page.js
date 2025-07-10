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
          router.push("/signup");
          return;
        }
        router.push("/home");
      } catch (err) {
        router.push("/signup");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return null;
}
