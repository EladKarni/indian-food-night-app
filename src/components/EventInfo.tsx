"use client";

import { useActiveEvent } from "@/hooks/useActiveEvent";
import { useHostProfile } from "@/hooks/useHostProfile";
import { useAuth } from "@/contexts/AuthContext";
import { usePathname } from "next/navigation";

// Helper function to convert 24-hour time to 12-hour AM/PM format
const formatTimeToAMPM = (time24: string): string => {
  const [hours, minutes] = time24.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};

interface UserInfoProps {
  showProfilePicture?: boolean;
  className?: string;
}

export default function EventInfo({ className }: UserInfoProps) {
  const { user } = useAuth();
  const { activeEvent } = useActiveEvent();
  const { hostProfile, loading } = useHostProfile(
    activeEvent?.host_id || undefined
  );
  const pathname = usePathname();

  if (!activeEvent) {
    return null;
  }

  const address = hostProfile?.address || activeEvent?.location || "";
  const restaurant = activeEvent?.restaurant || "Coriander Indian Grill";
  const isOrderPage = pathname === "/order";
  const isOrderOverviewPage = pathname === "/order-overview";

  // Hide if current user is the host AND on the overview page
  const isHost = user && activeEvent && activeEvent.host_id === user.id;
  if (isHost && isOrderOverviewPage) {
    return null;
  }

  // Generate URLs
  const googleMapsUrl = address 
    ? `https://www.google.com/maps?q=${encodeURIComponent(address)}`
    : null;
  const menuUrl = `https://www.google.com/search?q=${encodeURIComponent(restaurant + " menu")}`;

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
            <span>
              Hosted by {loading 
                ? "Loading..." 
                : hostProfile?.full_name || hostProfile?.email || "Host"}
              {activeEvent?.start_time
                ? ` @ ${formatTimeToAMPM(activeEvent.start_time)}`
                : " @ 6:30 PM"}
            </span>
          </div>
        </div>

        <button
          onClick={handleMenuClick}
          className="w-10 h-10 bg-orange-600 hover:bg-orange-700 rounded-full flex items-center justify-center ml-4 transition-colors duration-200 shadow-sm hover:shadow-md"
          title="View restaurant menu"
        >
          <span className="text-white text-lg">📋</span>
        </button>
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
          <span className="font-semibold text-slate-800 text-sm">
            {loading
              ? "Loading host..."
              : hostProfile?.full_name || hostProfile?.email || "Host"}
          </span>
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
        <button
          onClick={handleNavigateClick}
          className="w-10 h-10 bg-green-600 hover:bg-green-700 rounded-full flex items-center justify-center ml-4 transition-colors duration-200 shadow-sm hover:shadow-md"
          title="Navigate to location"
        >
          <span className="text-white text-lg">🚗</span>
        </button>
      )}
    </div>
  );
}
