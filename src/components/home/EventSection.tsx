"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useActiveEvent } from "@/hooks/useActiveEvent";
import { useGuestName } from "@/hooks/useGuestName";

function formatEventDate(dateStr: string) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatEventTime(time: string | null) {
  if (!time) return null;
  const [hRaw, mRaw] = time.split(":");
  const h = parseInt(hRaw, 10);
  const mer = h >= 12 ? "PM" : "AM";
  const h12 = ((h + 11) % 12) + 1;
  return `${h12}:${mRaw} ${mer}`;
}

const CalIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <rect
      x="3.5"
      y="5"
      width="17"
      height="15"
      rx="2.5"
      stroke="currentColor"
      strokeWidth="1.6"
    />
    <path
      d="M3.5 10h17M8 3v4M16 3v4"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
    <path
      d="M12 7.5V12l3 2"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

const HOST_AVATAR_COLORS = ["#C25A2C", "#2E7D5C", "#D4923A", "#4A4339"];

export default function EventSection() {
  const { activeEvent } = useActiveEvent();
  const { user } = useAuth();
  const { guestName, setGuestName, isValidGuestName } = useGuestName();

  if (!activeEvent) {
    return (
      <div className="ifn-card" style={{ padding: 18, textAlign: "center" }}>
        <div
          className="ifn-eyebrow"
          style={{ marginBottom: 8 }}
        >
          The table&apos;s set down
        </div>
        <div style={{ fontSize: 14, color: "var(--ifn-muted)" }}>
          No upcoming events — check back soon.
        </div>
      </div>
    );
  }

  const dateLabel = formatEventDate(activeEvent.event_date);
  const timeLabel = formatEventTime(activeEvent.start_time);
  const canJoin = !!user || isValidGuestName;

  return (
    <div className="ifn-card" style={{ padding: 18 }}>
      <div className="ifn-eyebrow" style={{ marginBottom: 10 }}>
        This Wednesday
      </div>
      <div
        style={{
          fontFamily: "var(--ifn-display)",
          fontSize: 28,
          lineHeight: 1,
          marginBottom: 12,
        }}
      >
        {activeEvent.restaurant || "Coriander Indian Grill"}
      </div>
      <div
        style={{
          display: "flex",
          gap: 14,
          color: "var(--ifn-muted)",
          fontSize: 13,
          marginBottom: 16,
        }}
      >
        <span
          style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
        >
          <CalIcon /> {dateLabel}
        </span>
        {timeLabel && (
          <span
            style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            <ClockIcon /> {timeLabel}
          </span>
        )}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 16,
        }}
      >
        <div style={{ display: "flex" }}>
          {HOST_AVATAR_COLORS.map((c, i) => (
            <div
              key={i}
              style={{
                width: 26,
                height: 26,
                borderRadius: "50%",
                background: c,
                border: "2px solid var(--ifn-surface)",
                marginLeft: i ? -8 : 0,
              }}
            />
          ))}
        </div>
        <span style={{ fontSize: 12.5, color: "var(--ifn-muted)" }}>
          Join the table
        </span>
      </div>

      {!user && (
        <input
          className="ifn-input"
          placeholder="Your name"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          style={{ marginBottom: 10 }}
        />
      )}
      <Link
        href="/order"
        className="ifn-btn ifn-btn--primary ifn-btn--full"
        style={
          canJoin
            ? undefined
            : {
                opacity: 0.45,
                pointerEvents: "none",
                cursor: "not-allowed",
              }
        }
      >
        Join the table
      </Link>
    </div>
  );
}
