"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Button from "@/ui/button";
import Icon from "@/ui/Icon";
import LoadingSpinner from "@/ui/LoadingSpinner";

interface GoogleSignInButtonProps {
  mode?: "signin" | "signup";
  onError?: (error: string) => void;
}

export default function GoogleSignInButton({
  mode = "signin",
  onError,
}: GoogleSignInButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);

    try {
      if (!supabase) {
        throw new Error("Supabase is not configured");
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) throw error;
    } catch (error: any) {
      setLoading(false);
      const errorMessage = error?.message || "An error occurred during sign-in";
      onError?.(errorMessage);
    }
  };

  const buttonText = mode === "signin" ? "Continue with Google" : "Sign up with Google";

  return (
    <Button
      type="button"
      onClick={handleGoogleSignIn}
      disabled={loading || !supabase}
      fullWidth={true}
      variant="outline"
      className="py-3 px-6 rounded-2xl bg-white hover:bg-gray-50 border-2 border-gray-300 text-gray-700 hover:border-gray-400 focus:ring-gray-400"
    >
      {loading ? (
        <LoadingSpinner
          size="sm"
          text={mode === "signin" ? "Signing in..." : "Signing up..."}
          className="text-gray-700"
        />
      ) : (
        <div className="flex items-center justify-center gap-3">
          <Icon name="google" size={20} className="text-gray-700" />
          <span className="font-medium">{buttonText}</span>
        </div>
      )}
    </Button>
  );
}
