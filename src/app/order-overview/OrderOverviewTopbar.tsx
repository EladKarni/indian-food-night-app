"use client";

import { useRouter } from "next/navigation";
import { BackIcon } from "@/ui/icons";
import ThemeToggle from "@/ui/ThemeToggle";

interface OrderOverviewTopbarProps {
  isHost: boolean;
  eventLabel: string | null;
}

export default function OrderOverviewTopbar({
  isHost,
  eventLabel,
}: OrderOverviewTopbarProps) {
  const router = useRouter();
  const showEyebrow = isHost && !!eventLabel;

  return (
    <div className="ifn-topbar">
      <button
        type="button"
        onClick={() => router.push("/order")}
        className="ifn-topbar-btn"
        style={{ cursor: "pointer" }}
      >
        <BackIcon />
      </button>
      <div className="ifn-topbar-title-block">
        {showEyebrow && <div className="ifn-topbar-eyebrow">{eventLabel}</div>}
        <div className="ifn-topbar-title">
          {isHost ? "Group order" : "Order placed"}
        </div>
      </div>
      <ThemeToggle />
    </div>
  );
}
