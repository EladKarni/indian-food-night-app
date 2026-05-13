"use client";

import Link from "next/link";
import { BackIcon, MoreIcon } from "@/ui/icons";

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
      <span className="ifn-topbar-btn">
        <MoreIcon />
      </span>
    </div>
  );
}
