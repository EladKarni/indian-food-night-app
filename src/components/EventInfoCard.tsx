"use client";

import { useActiveEvent } from "@/hooks/useActiveEvent";
import { useHostProfile } from "@/hooks/useHostProfile";
import { formatTimeToAMPM } from "@/util/timeUtils";
import EventInfoSkeleton from "./EventInfoSkeleton";
import HostByline from "./HostByline";

interface EventInfoCardProps {
  className?: string;
}

const DEFAULT_TIME_LABEL = "6:30 PM";

export default function EventInfoCard({ className }: EventInfoCardProps) {
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
  const timeLabel = activeEvent.start_time
    ? formatTimeToAMPM(activeEvent.start_time)
    : DEFAULT_TIME_LABEL;
  const googleMapsUrl = address
    ? `https://www.google.com/maps?q=${encodeURIComponent(address)}`
    : null;

  function renderDirectionsButton() {
    if (!googleMapsUrl) return null;
    return (
      <button
        type="button"
        onClick={() => window.open(googleMapsUrl, "_blank")}
        title="Navigate to location"
        className="ifn-btn ifn-btn--soft ifn-btn--xs"
      >
        Directions
      </button>
    );
  }

  return (
    <div
      className={`ifn-card ${className || ""}`}
      style={{ padding: 14, display: "flex", alignItems: "center", gap: 12 }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 500, marginBottom: 2 }}>
          <HostByline hostName={hostName} loading={loading} />
        </div>
        <div style={{ fontSize: 11.5, color: "var(--ifn-muted)" }}>
          {address || "Address not provided"} · {timeLabel}
        </div>
      </div>
      {renderDirectionsButton()}
    </div>
  );
}
