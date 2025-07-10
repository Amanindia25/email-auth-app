"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me");
        setIsAuth(res.ok);
      } catch {
        setIsAuth(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [pathname]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout");
    router.push("/signin");
  };

  return (
    <nav className="w-full flex items-center justify-between px-6 py-3 border-b bg-black text-white shadow-sm mb-6">
      <div className="text-xl font-bold tracking-tight select-none">
        Email Auth App
      </div>
      <div className="flex items-center gap-4">
        {loading ? null : isAuth ? (
          <>
            <Link
              href="/home"
              className="text-white hover:text-blue-400 font-medium"
            >
              Home
            </Link>
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="bg-red-600 hover:bg-red-700 text-white border-none"
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <Link
              href="/signup"
              className="text-white hover:text-blue-400 font-medium"
            >
              Signup
            </Link>
            <Link
              href="/signin"
              className="text-white hover:text-blue-400 font-medium"
            >
              Signin
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
