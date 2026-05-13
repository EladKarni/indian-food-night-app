"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function AuthSection() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 max-w-md mx-auto">
        <div className="text-center space-y-3 w-full">
          <p className="text-slate-600 text-lg">
            Want to host an event?
          </p>
          <Link
            href="/signup"
            className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-2xl transition-colors w-full text-center inline-block"
          >
            Sign Up to Host
          </Link>
          <p className="text-slate-500 text-sm mt-2">
            Already have an account?{" "}
            <Link href="/login" className="text-orange-500 hover:text-orange-600 underline">
              Login
            </Link>
          </p>
        </div>

      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center max-w-md mx-auto">
      <Link
        href="/dashboard"
        className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-2xl transition-colors w-full text-center inline-block"
      >
        Dashboard
      </Link>
    </div>
  );
}
