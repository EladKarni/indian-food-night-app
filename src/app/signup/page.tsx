"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import AuthField from "@/components/auth/AuthField";
import {
  BackIcon,
  GoogleIcon,
  LockIcon,
  MailIcon,
  PinIcon,
  UserIcon,
} from "@/components/auth/icons";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

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

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          address: address,
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
    } else {
      setMessage("Check your email for the confirmation link!");
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    }
    setLoading(false);
  };

  const handleGoogleSignUp = async () => {
    if (!supabase) {
      setError("Supabase is not configured.");
      return;
    }
    setGoogleLoading(true);
    setError("");
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
        queryParams: { access_type: "offline", prompt: "consent" },
      },
    });
    if (oauthError) {
      setGoogleLoading(false);
      setError(oauthError.message);
    }
  };

  return (
    <main className="ifn-screen ifn-app">
      <div
        style={{
          maxWidth: 420,
          margin: "0 auto",
          width: "100%",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div className="ifn-topbar">
          <Link
            href="/login"
            className="ifn-topbar-btn"
            style={{ textDecoration: "none" }}
            aria-label="Back to sign in"
          >
            <BackIcon color="var(--ifn-ink-2)" />
          </Link>
          <span style={{ flex: 1 }} />
          <span style={{ width: 38, height: 38 }} />
        </div>

        <form
          onSubmit={handleSignUp}
          autoComplete="on"
          style={{
            flex: 1,
            padding: "8px 28px 32px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <input
            type="hidden"
            name="country"
            autoComplete="country"
            value="US"
          />

          <div style={{ marginBottom: 28 }}>
            <div className="ifn-eyebrow" style={{ marginBottom: 8 }}>
              New here
            </div>
            <div
              className="ifn-display"
              style={{ fontSize: 44, lineHeight: 1, letterSpacing: "-0.015em" }}
            >
              Save your
              <br />
              <span
                style={{ fontStyle: "italic", color: "var(--ifn-primary)" }}
              >
                seat.
              </span>
            </div>
            <p
              style={{
                marginTop: 14,
                color: "var(--ifn-muted)",
                fontSize: 14,
                lineHeight: 1.45,
              }}
            >
              A spot at the table, your spice on file, and one tap to pay the
              host.
            </p>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignUp}
            disabled={googleLoading || !supabase}
            className="ifn-btn ifn-btn--ghost ifn-btn--full"
            style={{
              background: "var(--ifn-surface)",
              padding: "14px 16px",
              fontSize: 14.5,
            }}
          >
            <GoogleIcon />
            {googleLoading ? "Opening Google…" : "Continue with Google"}
          </button>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              margin: "20px 0 16px",
            }}
          >
            <div
              style={{ flex: 1, height: 1, background: "var(--ifn-border)" }}
            />
            <span className="ifn-eyebrow" style={{ fontSize: 10 }}>
              or with email
            </span>
            <div
              style={{ flex: 1, height: 1, background: "var(--ifn-border)" }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <AuthField
              icon={<UserIcon color="var(--ifn-muted)" />}
              placeholder="Full name"
              value={name}
              onChange={setName}
              name="name"
              autoComplete="name"
              required
            />
            <AuthField
              icon={<MailIcon color="var(--ifn-muted)" />}
              placeholder="Email"
              type="email"
              value={email}
              onChange={setEmail}
              name="email"
              autoComplete="email"
              required
            />
            <AuthField
              icon={<PinIcon color="var(--ifn-muted)" />}
              placeholder="Street address"
              value={address}
              onChange={setAddress}
              name="address-line1"
              autoComplete="address-line1"
              required
            />
            <AuthField
              icon={<LockIcon color="var(--ifn-muted)" />}
              placeholder="Create a password"
              type="password"
              value={password}
              onChange={setPassword}
              name="password"
              autoComplete="new-password"
              required
              minLength={6}
            />
          </div>

          {error && (
            <div
              style={{
                marginTop: 14,
                fontSize: 13,
                color: "var(--ifn-chili)",
                background: "var(--ifn-pill-chili-bg)",
                padding: "10px 12px",
                borderRadius: 12,
              }}
            >
              {error}
            </div>
          )}
          {message && (
            <div
              style={{
                marginTop: 14,
                fontSize: 13,
                color: "var(--ifn-green)",
                background: "var(--ifn-pill-green-bg)",
                padding: "10px 12px",
                borderRadius: 12,
              }}
            >
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !supabase}
            className="ifn-btn ifn-btn--primary ifn-btn--full"
            style={{ marginTop: 18 }}
          >
            {loading ? "Creating account…" : "Create account"}
          </button>

          <div style={{ flex: 1 }} />

          <div
            style={{
              textAlign: "center",
              fontSize: 13,
              color: "var(--ifn-muted)",
              marginTop: 22,
            }}
          >
            Already at the table?{" "}
            <Link
              href="/login"
              style={{
                color: "var(--ifn-ink)",
                fontWeight: 500,
                borderBottom: "1px solid var(--ifn-border-strong)",
                paddingBottom: 1,
                textDecoration: "none",
              }}
            >
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
