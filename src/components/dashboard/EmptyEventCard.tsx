"use client";

import Link from "next/link";

export default function EmptyEventCard() {
  return (
    <div
      className="ifn-card"
      style={{
        padding: 18,
        marginBottom: 14,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="ifn-eyebrow">Up next</div>
      <div
        className="ifn-display"
        style={{ fontSize: 22, marginTop: 6, marginBottom: 14 }}
      >
        No event on the table.
      </div>
      <Link
        href="/create-event"
        className="ifn-btn ifn-btn--primary ifn-btn--full"
      >
        Host next Wednesday
      </Link>
    </div>
  );
}
