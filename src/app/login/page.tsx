"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (!supabase) {
      setError(
        "Supabase is not configured. Please check your environment variables."
      );
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage("Successfully signed in!");
      router.push("/order");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-200 via-rose-300 to-slate-500 flex items-center justify-center p-4 relative">
      {/* Back to Home button */}
      <Link
        href="/"
        className="absolute top-6 left-6 text-slate-700 hover:text-slate-900 flex items-center space-x-2 transition-colors"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        <span className="text-sm font-medium">Back to Home</span>
      </Link>

      <div className="w-full max-w-sm bg-gradient-to-b from-orange-200/90 to-orange-100/90 rounded-3xl p-8 shadow-2xl backdrop-blur-sm">
        {!supabase && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            <span className="text-sm">
              ⚠️ Supabase not configured. Please set up your environment
              variables.
            </span>
          </div>
        )}

        {/* Illustration Area */}
        <div className="text-center mb-8">
          <div className="w-32 h-32 mx-auto mb-6 relative">
            {/* Simple illustration using CSS */}
            <div className="absolute inset-0 bg-orange-400 rounded-lg transform rotate-12 shadow-lg"></div>
            <div className="absolute top-2 left-2 w-28 h-28 bg-orange-500 rounded-lg shadow-md"></div>
            <div className="absolute top-4 left-4 w-24 h-20 bg-orange-300 rounded-md"></div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-700 rounded-full shadow-lg"></div>
            <div className="absolute -bottom-1 -left-1 w-6 h-12 bg-green-600 rounded-full"></div>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Host Login</h2>
          <p className="text-slate-600 text-sm italic">Login to host IFN</p>
        </div>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          {/* Email Input */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-slate-600"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full pl-12 pr-4 py-3 bg-white/70 border-none rounded-2xl placeholder-slate-500 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-slate-600"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <circle cx="12" cy="16" r="1"></circle>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full pl-12 pr-4 py-3 bg-white/70 border-none rounded-2xl placeholder-slate-500 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Forgot Password Link */}
          <div className="text-center">
            <button
              type="button"
              className="text-slate-600 text-sm hover:text-slate-800 transition-colors"
            >
              Forgot your password?
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm">
              <span>{error}</span>
            </div>
          )}

          {message && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg text-sm">
              <span>{message}</span>
            </div>
          )}

          {/* Sign In Button */}
          <button
            type="submit"
            onClick={handleSignIn}
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-2xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Signing In...</span>
              </div>
            ) : (
              "Sign In"
            )}
          </button>

          {/* Sign Up Link */}
          <div className="text-center pt-4">
            <span className="text-slate-600 text-sm">Want to host? </span>
            <Link
              href="/signup"
              className="text-slate-800 font-semibold text-sm hover:text-slate-900 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
