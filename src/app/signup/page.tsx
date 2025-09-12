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
    <AuthLayout backButton={<BackButton href="/login" />}>
        {!supabase && (
          <AlertMessage type="error" className="mb-6">
            ⚠️ Supabase not configured. Please set up your environment variables.
          </AlertMessage>
        )}

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Signup</h2>
        </div>

        <form className="space-y-4" onSubmit={handleSignUp} autoComplete="on" method="post">
          {/* Hidden inputs to help browser autocomplete recognition */}
          <input type="hidden" name="country" autoComplete="country" value="US" />
          
          {/* Name Input */}
          <FormInput
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            autoCapitalize="words"
            spellCheck={false}
            required
            variant="auth"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            rightIcon={<Icon name="user" size={16} className="text-orange-500" />}
          />

          {/* Email Input */}
          <FormInput
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            required
            variant="auth"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            rightIcon={<Icon name="mail" size={16} className="text-orange-500" />}
          />

          {/* Address Input */}
          <FormInput
            id="address-line1"
            name="address-line1"
            type="text"
            autoComplete="address-line1"
            autoCapitalize="words"
            spellCheck={false}
            required
            variant="auth"
            placeholder="Street Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rightIcon={<Icon name="location" size={16} className="text-orange-500" />}
          />

          {/* Password Input */}
          <FormInput
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            autoCapitalize="none"
            spellCheck={false}
            required
            minLength={6}
            variant="auth"
            placeholder="Create Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <AlertMessage type="error">
              {error}
            </AlertMessage>
          )}

          {message && (
            <AlertMessage type="success">
              {message}
            </AlertMessage>
          )}

          {/* Sign Up Button */}
          <div className="pt-4">
            <Button
              type="submit"
              disabled={loading}
              fullWidth={true}
              variant="primary"
              className="py-3 px-6 rounded-2xl"
            >
              {loading ? (
                <LoadingSpinner size="sm" text="Creating Account..." className="text-white" />
              ) : (
                "Sign Up"
              )}
            </Button>
          </div>

          {/* Login Link */}
          <div className="text-center pt-4">
            <span className="text-slate-600 text-sm">Already have an account? </span>
            <FormLink href="/login">
              Sign In
            </FormLink>
          </div>
        </form>
    </AuthLayout>
  );
}