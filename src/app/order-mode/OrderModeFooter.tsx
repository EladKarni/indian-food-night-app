"use client";

import Link from "next/link";

export default function OrderModeFooter() {
  return (
    <div className="ifn-stack" style={{ marginTop: 24 }}>
      <Link
        href="/order-overview"
        className="ifn-btn ifn-btn--ghost ifn-btn--full"
        style={{ textDecoration: "none" }}
      >
        Back to overview
      </Link>
      <Link
        href="/dashboard"
        className="ifn-btn ifn-btn--soft ifn-btn--full"
        style={{ textDecoration: "none" }}
      >
        Back to dashboard
      </Link>
    </div>
  );
}
