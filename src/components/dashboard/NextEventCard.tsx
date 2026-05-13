"use client";

import Link from "next/link";
import type { Event } from "@/lib/queries/events";
import { formatDayOfMonth } from "@/util/dateUtils";
import { formatTimeToAMPM } from "@/util/timeUtils";

interface NextEventCardProps {
  event: Event;
  orderCount: number;
  isHost: boolean;
}

export default function NextEventCard({
  event,
  orderCount,
  isHost,
}: NextEventCardProps) {
  const eventDay = formatDayOfMonth(event.event_date);
  const eventTime = event.start_time ? formatTimeToAMPM(event.start_time) : null;

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
      <div
        className="ifn-display"
        style={{
          position: "absolute",
          right: -8,
          top: -22,
          fontSize: 140,
          color: "var(--ifn-primary-soft)",
          letterSpacing: "-0.04em",
          pointerEvents: "none",
        }}
        aria-hidden="true"
      >
        {eventDay}
      </div>
      <div className="ifn-eyebrow" style={{ position: "relative" }}>
        Next Wednesday
      </div>
      <div
        className="ifn-display"
        style={{
          fontSize: 26,
          marginTop: 6,
          marginBottom: 10,
          position: "relative",
        }}
      >
        {event.restaurant || "Coriander Grill"}
      </div>
      <div
        style={{
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          marginBottom: 14,
          position: "relative",
        }}
      >
        {eventTime && <span className="ifn-pill">{eventTime}</span>}
        <span className="ifn-pill">{orderCount} joined</span>
        {isHost && <span className="ifn-pill ifn-pill--accent">You host</span>}
      </div>
      <Link
        href="/order"
        className="ifn-btn ifn-btn--primary ifn-btn--full"
        style={{ position: "relative" }}
      >
        {isHost ? "Open event" : "Add your order"}
      </Link>
    </div>
  );
}
