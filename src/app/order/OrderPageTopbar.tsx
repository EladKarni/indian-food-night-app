"use client";

import Link from "next/link";
import { BackIcon } from "@/ui/icons";
import ThemeToggle from "@/ui/ThemeToggle";

interface OrderPageTopbarProps {
  restaurant: string;
}

export default function OrderPageTopbar({ restaurant }: OrderPageTopbarProps) {
  return (
    <div className="ifn-topbar">
      <Link
        href="/dashboard"
        className="ifn-topbar-btn"
        style={{ textDecoration: "none" }}
      >
        <BackIcon />
      </Link>
      <div className="ifn-topbar-title-block">
        <div className="ifn-topbar-eyebrow">Ordering from</div>
        <div className="ifn-topbar-title">{restaurant}</div>
      </div>
      <ThemeToggle />
    </div>
  );
}
