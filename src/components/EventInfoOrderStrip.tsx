"use client";

import { useActiveEvent } from "@/hooks/useActiveEvent";
import { useHostProfile } from "@/hooks/useHostProfile";
import { formatTimeToAMPM } from "@/util/timeUtils";
import EventInfoSkeleton from "./EventInfoSkeleton";
import HostByline from "./HostByline";

interface EventInfoOrderStripProps {
  className?: string;
}

const RESTAURANT_MENU_URL = "https://corianderindiangrill.com/ourmenu.html";
const DEFAULT_TIME_LABEL = "6:30 PM";

export default function EventInfoOrderStrip({
  className,
}: EventInfoOrderStripProps) {
  const { activeEvent, loading: eventLoading } = useActiveEvent();
  const { hostProfile, loading } = useHostProfile(
    activeEvent?.host_id || undefined
  );

  if (eventLoading) {
    return <EventInfoSkeleton className={className} />;
  }
  if (!activeEvent) {
    return null;
  }

  const address = activeEvent.location || "Contact Host For Info";
  const hostName = hostProfile?.full_name || hostProfile?.email || "Host";
  const initial = hostName.charAt(0).toUpperCase();
  const timeLabel = activeEvent.start_time
    ? formatTimeToAMPM(activeEvent.start_time)
    : DEFAULT_TIME_LABEL;

  return (
    <div
      className={`ifn-row ${className || ""}`}
      style={{ padding: "10px 0 18px" }}
    >
      <button
        type="button"
        onClick={() => window.open(RESTAURANT_MENU_URL, "_blank")}
        title="View restaurant menu"
        className="ifn-avatar"
      >
        {initial}
      </button>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 500 }}>
          <HostByline hostName={hostName} loading={loading} />
        </div>
        <div style={{ fontSize: 11.5, color: "var(--ifn-muted)" }}>
          {address} · {timeLabel}
        </div>
      </div>
      <span className="ifn-pill ifn-pill--green">
        <span className="ifn-status-dot ifn-status-dot--green ifn-status-dot--sm" />
        Open
      </span>
    </div>
  );
}
