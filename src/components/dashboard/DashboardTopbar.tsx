"use client";

import Link from "next/link";
import ThemeToggle from "@/ui/ThemeToggle";
import { UserIcon } from "./icons";

interface DashboardTopbarProps {
  isHost: boolean;
}

export default function DashboardTopbar({ isHost }: DashboardTopbarProps) {
  return (
    <div className="ifn-topbar">
      <span style={{ width: 38, height: 38 }} />
      <div style={{ textAlign: "center", flex: 1 }}>
        <div className="ifn-eyebrow" style={{ fontSize: 10, marginBottom: 2 }}>
          Indian Food Night
        </div>
        <div
          style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.01em" }}
        >
          {isHost ? "Hosting" : "Your week"}
        </div>
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        <ThemeToggle />
        <Link
          href="/profile/edit"
          className="ifn-topbar-btn"
          style={{ textDecoration: "none" }}
          aria-label="Edit profile"
        >
          <UserIcon color="var(--ifn-ink-2)" />
        </Link>
      </div>
    </div>
  );
}
