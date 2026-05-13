"use client";

import { useRouter } from "next/navigation";
import { BackIcon } from "@/ui/icons";
import ThemeToggle from "@/ui/ThemeToggle";

export default function MenuPageTopbar() {
  const router = useRouter();

  return (
    <div className="ifn-topbar">
      <button
        type="button"
        onClick={() => router.back()}
        className="ifn-topbar-btn"
        style={{ cursor: "pointer" }}
        aria-label="Back"
      >
        <BackIcon />
      </button>
      <div className="ifn-topbar-title-block">
        <div className="ifn-topbar-eyebrow">Browsing</div>
        <div className="ifn-topbar-title">Full menu</div>
      </div>
      <ThemeToggle />
    </div>
  );
}
