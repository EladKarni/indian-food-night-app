"use client";

import Link from "next/link";
import { AppPhoneIcon } from "@/ui/icons";

interface HostRunningTotalCardProps {
  submittedCount: number;
  totalCount: number;
  runningTotal: number;
}

export default function HostRunningTotalCard({
  submittedCount,
  totalCount,
  runningTotal,
}: HostRunningTotalCardProps) {
  return (
    <div
      className="ifn-card ifn-card--dark"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: 16,
        marginBottom: 18,
      }}
    >
      <div style={{ flex: 1 }}>
        <div
          className="ifn-eyebrow ifn-eyebrow--on-dark"
          style={{ marginBottom: 4 }}
        >
          {submittedCount} of {totalCount} in
        </div>
        <div className="ifn-display" style={{ fontSize: 22, lineHeight: 1 }}>
          ${runningTotal.toFixed(2)} so far
        </div>
      </div>
      <Link
        href="/order-mode"
        className="ifn-btn ifn-btn--primary ifn-btn--sm"
        style={{ textDecoration: "none" }}
      >
        <AppPhoneIcon />
        Call order
      </Link>
    </div>
  );
}
