"use client";

import { useActiveEvent } from "@/hooks/useActiveEvent";
import { useHostProfile } from "@/hooks/useHostProfile";
import { useAuth } from "@/contexts/AuthContext";
import { usePathname } from "next/navigation";
import { formatTimeToAMPM } from "@/util/timeUtils";

interface UserInfoProps {
  showProfilePicture?: boolean;
  className?: string;
}

function EventInfoSkeleton({ className }: { className?: string }) {
  return (
    <div className={`flex items-center justify-between ${className || ""}`}>
      <div className="flex-1 space-y-2">
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-sm mr-3 skeleton bg-slate-300/60" />
          <div className="skeleton h-3.5 w-40 bg-slate-300/60" />
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-sm mr-3 skeleton bg-slate-300/60" />
          <div className="skeleton h-3 w-48 bg-slate-300/60" />
        </div>
      </div>
      <div className="skeleton w-10 h-10 rounded-full ml-4 bg-slate-300/60" />
    </div>
  );
}

export default function EventInfo({ className }: UserInfoProps) {
  const { user } = useAuth();
  const { activeEvent, loading: eventLoading } = useActiveEvent();
  const { hostProfile, loading } = useHostProfile(
    activeEvent?.host_id || undefined
  );
  const pathname = usePathname();
  const isOrderOverviewPage = pathname === "/order-overview";

  // While the active event is loading, render a skeleton placeholder so the
  // page does not flash empty -> populated. Skip the skeleton on the overview
  // page because hosts hide this component entirely once the event resolves —
  // showing then collapsing the skeleton would itself cause a layout shift.
  if (eventLoading) {
    if (isOrderOverviewPage) {
      return null;
    }
    return <EventInfoSkeleton className={className} />;
  }

  if (!activeEvent) {
    return null;
  }

  const address = activeEvent?.location || "Contact Host For Info";
  const isOrderPage = pathname === "/order";

  // Hide if current user is the host AND on the overview page
  const isHost = user && activeEvent && activeEvent.host_id === user.id;
  if (isHost && isOrderOverviewPage) {
    return null;
  }

  // Generate URLs
  const googleMapsUrl = address
    ? `https://www.google.com/maps?q=${encodeURIComponent(address)}`
    : null;
  const menuUrl = "https://corianderindiangrill.com/ourmenu.html";

  const handleMenuClick = () => {
    window.open(menuUrl, '_blank');
  };

  const handleNavigateClick = () => {
    if (googleMapsUrl) {
      window.open(googleMapsUrl, '_blank');
    }
  };

  // ORDERING LAYOUT - host strip with avatar, name, address/time, "Open" pill
  if (isOrderPage) {
    const hostName =
      hostProfile?.full_name || hostProfile?.email || "Host";
    const initial = hostName.charAt(0).toUpperCase();
    const timeLabel = activeEvent?.start_time
      ? formatTimeToAMPM(activeEvent.start_time)
      : "6:30 PM";
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 0 18px",
        }}
        className={className}
      >
        <button
          type="button"
          onClick={handleMenuClick}
          title="View restaurant menu"
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "var(--ifn-primary)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 13,
            fontWeight: 500,
            border: 0,
            cursor: "pointer",
          }}
        >
          {initial}
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 500 }}>
            {loading ? (
              <span
                className="ifn-skel"
                style={{
                  display: "inline-block",
                  width: 120,
                  height: 12,
                  verticalAlign: "middle",
                }}
              />
            ) : (
              `Hosted by ${hostName}`
            )}
          </div>
          <div style={{ fontSize: 11.5, color: "var(--ifn-muted)" }}>
            {address} · {timeLabel}
          </div>
        </div>
        <span className="ifn-pill ifn-pill--green">
          <span
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: "var(--ifn-green)",
            }}
          />
          Open
        </span>
      </div>
    );
  }

  // NAVIGATION LAYOUT - host + address card for overview/other pages
  const hostName = hostProfile?.full_name || hostProfile?.email || "Host";
  const timeLabel = activeEvent?.start_time
    ? formatTimeToAMPM(activeEvent.start_time)
    : "6:30 PM";

  return (
    <div
      className={`ifn-card ${className || ""}`}
      style={{
        padding: 14,
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 500, marginBottom: 2 }}>
          {loading ? (
            <span
              className="ifn-skel"
              style={{
                display: "inline-block",
                width: 120,
                height: 12,
                verticalAlign: "middle",
              }}
            />
          ) : (
            `Hosted by ${hostName}`
          )}
        </div>
        <div style={{ fontSize: 11.5, color: "var(--ifn-muted)" }}>
          {address || "Address not provided"} · {timeLabel}
        </div>
      </div>
      {address && (
        <button
          type="button"
          onClick={handleNavigateClick}
          title="Navigate to location"
          className="ifn-btn ifn-btn--soft"
          style={{ padding: "8px 12px", fontSize: 12 }}
        >
          Directions
        </button>
      )}
    </div>
  );
}
