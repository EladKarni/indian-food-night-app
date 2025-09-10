"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import AuthLayout from "@/ui/AuthLayout";
import FormInput from "@/ui/FormInput";
import FormLink from "@/ui/FormLink";
import BackButton from "@/ui/BackButton";
import AlertMessage from "@/ui/AlertMessage";
import LoadingSpinner from "@/ui/LoadingSpinner";
import Button from "@/ui/button";
import Icon from "@/ui/Icon";

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
      router.push("/dashboard");
    }
    setLoading(false);
  };

  return (
    <AuthLayout
      backButton={<BackButton href="/" label="Back to Home" showLabel />}
    >
      {!supabase && (
        <AlertMessage type="error" className="mb-6">
          ⚠️ Supabase not configured. Please set up your environment variables.
        </AlertMessage>
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
        <FormInput
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          variant="auth"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leftIcon={<Icon name="user" size={16} className="text-slate-600" />}
          className="pl-12 pr-4 py-3 bg-white/70 border-none rounded-2xl placeholder-slate-500 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white"
        />

        {/* Password Input */}
        <FormInput
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          variant="auth"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          leftIcon={<Icon name="lock" size={16} className="text-slate-600" />}
          className="pl-12 pr-4 py-3 bg-white/70 border-none rounded-2xl placeholder-slate-500 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white"
        />

        {/* Forgot Password Link */}
        <div className="text-center">
          <button
            type="button"
            className="text-slate-600 text-sm hover:text-slate-800 transition-colors"
          >
            Forgot your password?
          </button>
        </div>

        {error && <AlertMessage type="error">{error}</AlertMessage>}

        {message && <AlertMessage type="success">{message}</AlertMessage>}

        {/* Sign In Button */}
        <Button
          type="submit"
          onClick={() => handleSignIn(new Event("submit") as any)}
          disabled={loading}
          fullWidth={true}
          variant="primary"
          className="py-3 px-6 rounded-2xl"
        >
          {loading ? (
            <LoadingSpinner
              size="sm"
              text="Signing In..."
              className="text-white"
            />
          ) : (
            "Sign In"
          )}
        </Button>

        {/* Sign Up Link */}
        <div className="text-center pt-4">
          <span className="text-slate-600 text-sm">Want to host? </span>
          <FormLink href="/signup">Sign Up</FormLink>
        </div>
      </form>
    </AuthLayout>
  );
}
