"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
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

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          address: address,
        },
      },
    });

    if (error) {
      setError(error.message);
    } else {
      // If you have a profiles table, you can also insert there
      if (data.user) {
        try {
          // Optional: Insert into profiles table if it exists
          // await supabase.from('profiles').insert({
          //   id: data.user.id,
          //   full_name: name,
          //   address: address,
          //   email: email,
          // });
        } catch (profileError) {
          console.log('Profile creation error:', profileError);
          // Don't show this error to user since signup was successful
        }
      }
      
      setMessage("Check your email for the confirmation link!");
      // Optionally redirect to login page after a delay
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-200 via-rose-300 to-slate-500 flex items-center justify-center p-4 relative">
      {/* Back button */}
      <Link
        href="/login"
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

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Signup</h2>
        </div>

        <form className="space-y-4" onSubmit={handleSignUp} autoComplete="on" method="post">
          {/* Hidden inputs to help browser autocomplete recognition */}
          <input type="hidden" name="country" autoComplete="country" value="US" />
          
          {/* Name Input */}
          <div className="relative">
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-orange-500"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              autoCapitalize="words"
              spellCheck={false}
              required
              className="w-full pl-4 pr-12 py-3 bg-white/70 border-2 border-dashed border-slate-400 rounded-2xl placeholder-slate-500 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white focus:border-solid"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Email Input */}
          <div className="relative">
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-orange-500"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </div>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              autoCapitalize="none"
              spellCheck={false}
              required
              className="w-full pl-4 pr-12 py-3 bg-white/70 border-2 border-dashed border-slate-400 rounded-2xl placeholder-slate-500 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white focus:border-solid"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Address Input */}
          <div className="relative">
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-orange-500"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
            <input
              id="address-line1"
              name="address-line1"
              type="text"
              autoComplete="address-line1"
              autoCapitalize="words"
              spellCheck={false}
              required
              className="w-full pl-4 pr-12 py-3 bg-white/70 border-2 border-dashed border-slate-400 rounded-2xl placeholder-slate-500 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white focus:border-solid"
              placeholder="Street Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              autoCapitalize="none"
              spellCheck={false}
              required
              minLength={6}
              className="w-full pl-4 pr-4 py-3 bg-white/70 border-2 border-dashed border-slate-400 rounded-2xl placeholder-slate-500 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white focus:border-solid"
              placeholder="Create Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
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

          {/* Sign Up Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-2xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Creating Account...</span>
                </div>
              ) : (
                "Sign Up"
              )}
            </button>
          </div>

          {/* Login Link */}
          <div className="text-center pt-4">
            <span className="text-slate-600 text-sm">Already have an account? </span>
            <Link
              href="/login"
              className="text-slate-800 font-semibold text-sm hover:text-slate-900 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}