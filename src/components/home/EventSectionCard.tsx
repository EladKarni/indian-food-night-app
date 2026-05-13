"use client";

import Link from "next/link";
import type { Event } from "@/hooks/useActiveEvent";
import { useAuth } from "@/contexts/AuthContext";
import { useGuestName } from "@/hooks/useGuestName";
import { formatEventDate, formatEventTime } from "@/util/dateUtils";
import { CalendarIcon, ClockIcon } from "@/ui/icons";

interface EventSectionCardProps {
  event: Event;
}

const HOST_AVATAR_COLORS = ["#C25A2C", "#2E7D5C", "#D4923A", "#4A4339"];
const DEFAULT_RESTAURANT = "Coriander Indian Grill";

export default function EventSectionCard({ event }: EventSectionCardProps) {
  const { user } = useAuth();
  const { guestName, setGuestName, isValidGuestName } = useGuestName();

  const dateLabel = formatEventDate(event.event_date);
  const timeLabel = formatEventTime(event.start_time);
  const canJoin = !!user || isValidGuestName;

  function renderDateRow() {
    return (
      <div
        style={{
          display: "flex",
          gap: 14,
          color: "var(--ifn-muted)",
          fontSize: 13,
          marginBottom: 16,
        }}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <CalendarIcon /> {dateLabel}
        </span>
        {timeLabel && (
          <span
            style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            <ClockIcon /> {timeLabel}
          </span>
        )}
      </div>
    );
  }

  function renderAvatarStack() {
    return (
      <div className="ifn-row" style={{ marginBottom: 16 }}>
        <div style={{ display: "flex" }}>
          {HOST_AVATAR_COLORS.map((color, i) => (
            <div
              key={i}
              className="ifn-avatar ifn-avatar--sm"
              style={{
                background: color,
                border: "2px solid var(--ifn-surface)",
                marginLeft: i ? -8 : 0,
                cursor: "default",
              }}
            />
          ))}
        </div>
        <span style={{ fontSize: 12.5, color: "var(--ifn-muted)" }}>
          Join the table
        </span>
      </div>
    );
  }

  function renderGuestNameInput() {
    if (user) return null;
    return (
      <input
        className="ifn-input"
        placeholder="Your name"
        value={guestName}
        onChange={(e) => setGuestName(e.target.value)}
        style={{ marginBottom: 10 }}
      />
    );
  }

  const joinButtonStyle = canJoin
    ? undefined
    : {
        opacity: 0.45,
        pointerEvents: "none" as const,
        cursor: "not-allowed" as const,
      };

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
        {event.restaurant || DEFAULT_RESTAURANT}
      </div>
      {renderDateRow()}
      {renderAvatarStack()}
      {renderGuestNameInput()}
      <Link
        href="/order"
        className="ifn-btn ifn-btn--primary ifn-btn--full"
        style={joinButtonStyle}
      >
        Join the table
      </Link>
    </div>
  );
}
