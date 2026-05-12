"use client";

import { useActiveEvent } from "@/hooks/useActiveEvent";
import { useHostProfile } from "@/hooks/useHostProfile";
import { useAuth } from "@/contexts/AuthContext";
import { usePathname } from "next/navigation";
import { formatTimeToAMPM } from "@/util/timeUtils";
import IconButton from "@/ui/IconButton";

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
  const restaurant = activeEvent?.restaurant || "Coriander Indian Grill";
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

  // ORDERING LAYOUT - Show restaurant and host info for ordering
  if (isOrderPage) {
    return (
      <div className={`flex items-center justify-between ${className || ''}`}>
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <div className="w-4 h-4 bg-orange-600 rounded-sm flex items-center justify-center mr-3">
              <span className="text-white text-xs">🍽️</span>
            </div>
            <span className="font-semibold text-slate-800 text-sm">
              {restaurant}
            </span>
          </div>
          <div className="flex items-center text-xs text-slate-700">
            <div className="w-4 h-4 bg-blue-600 rounded-sm flex items-center justify-center mr-3">
              <span className="text-white text-xs">👤</span>
            </div>
            {loading ? (
              <span className="flex items-center gap-2">
                Hosted by
                <span className="skeleton h-3 w-24 bg-slate-300/60 inline-block align-middle" />
                {activeEvent?.start_time
                  ? `@ ${formatTimeToAMPM(activeEvent.start_time)}`
                  : "@ 6:30 PM"}
              </span>
            ) : (
              <span>
                Hosted by {hostProfile?.full_name || hostProfile?.email || "Host"}
                {activeEvent?.start_time
                  ? ` @ ${formatTimeToAMPM(activeEvent.start_time)}`
                  : " @ 6:30 PM"}
              </span>
            )}
          </div>
        </div>

        <IconButton
          onClick={handleMenuClick}
          className="w-10 h-10 bg-orange-600 hover:bg-orange-700 ml-4 shadow-sm hover:shadow-md"
          title="View restaurant menu"
          icon={<span className="text-white text-lg">📋</span>}
        />
      </div>
    );
  }

  // NAVIGATION LAYOUT - Show address and navigation for overview/other pages
  return (
    <div className={`flex items-center justify-between ${className || ''}`}>
      <div className="flex-1">
        <div className="flex items-center mb-2">
          <div className="w-4 h-4 bg-blue-600 rounded-sm flex items-center justify-center mr-3">
            <span className="text-white text-xs">👤</span>
          </div>
          {loading ? (
            <span className="skeleton h-3.5 w-32 bg-slate-300/60 inline-block align-middle" />
          ) : (
            <span className="font-semibold text-slate-800 text-sm">
              {hostProfile?.full_name || hostProfile?.email || "Host"}
            </span>
          )}
        </div>
        <div className="flex items-center text-xs text-slate-700">
          <div className="w-4 h-4 bg-green-600 rounded-sm flex items-center justify-center mr-3">
            <span className="text-white text-xs">🏠</span>
          </div>
          <span className="flex-1">
            {address || "Address not provided"}
            {activeEvent?.start_time
              ? ` @ ${formatTimeToAMPM(activeEvent.start_time)}`
              : " @ 6:30 PM"}
          </span>
        </div>
      </div>

      {address && (
        <IconButton
          onClick={handleNavigateClick}
          className="w-10 h-10 bg-green-600 hover:bg-green-700 ml-4 shadow-sm hover:shadow-md"
          title="Navigate to location"
          icon={<span className="text-white text-lg">🚗</span>}
        />
      )}
    </div>
  );
}
