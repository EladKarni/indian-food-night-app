"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

const underlineStyle = {
  color: "var(--ifn-ink)",
  borderBottom: "1px solid var(--ifn-border-strong)",
  paddingBottom: 1,
};

export default function AuthSection() {
  const { user } = useAuth();

  if (user) {
    return (
      <div
        style={{
          textAlign: "center",
          fontSize: 13,
          color: "var(--ifn-muted)",
        }}
      >
        <Link href="/dashboard" style={underlineStyle}>
          Go to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div
      style={{
        textAlign: "center",
        fontSize: 13,
        color: "var(--ifn-muted)",
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      <div>
        Want to host?{" "}
        <Link href="/signup" style={underlineStyle}>
          Sign up
        </Link>
      </div>
      <div>
        Already a regular?{" "}
        <Link href="/login" style={underlineStyle}>
          Sign in
        </Link>
      </div>
    </div>
  );
}
