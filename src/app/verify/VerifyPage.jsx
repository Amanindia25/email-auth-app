"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) return;

      try {
        const res = await fetch("/api/auth/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();
        if (res.ok) {
          setStatus({ success: true, message: data.message });
        } else {
          setStatus({ success: false, message: data.error });
        }
      } catch (error) {
        setStatus({ success: false, message: "Something went wrong!" });
      } finally {
        setLoading(false);
      }
    };
    verifyEmail();
  }, [token]);

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="max-w-md w-full bg-white shadow-md p-6 rounded-lg">
        {loading ? (
          <p className="text-gray-700 text-center">Verifying token...</p>
        ) : status?.success ? (
          <>
            <h2 className="text-green-600 font-semibold text-lg text-center mb-4">
              ✅ Success
            </h2>
            <p className="text-center mb-2">{status.message}</p>
            <p className="text-sm text-gray-500 text-center">
              You can now sign in to your account.
            </p>
            <Button
              className="mt-4 w-full"
              onClick={() => (window.location.href = "/signin")}
            >
              Go to Sign In Now
            </Button>
            <p className="text-sm text-center mt-4 text-gray-600">
              Already signed up earlier?&nbsp;
              <Link href="/signin" className="text-blue-600 hover:underline">
                Sign in here
              </Link>
              <br />
              Don&#39;t have an account?{" "}
              <Link href="/signup" className="text-blue-600 hover:underline">
                Sign up here
              </Link>
            </p>
          </>
        ) : (
          <>
            <h2 className="text-red-600 font-semibold text-lg text-center mb-4">
              ❌ Failed
            </h2>
            <p className="text-center">{status?.message}</p>
            <p className="text-sm text-center mt-4 text-gray-600">
              Already signed up earlier?&nbsp;
              <Link href="/signin" className="text-blue-600 hover:underline">
                Sign in here
              </Link>
              <br />
              Don&#39;t have an account?{" "}
              <Link href="/signup" className="text-blue-600 hover:underline">
                Sign up here
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
