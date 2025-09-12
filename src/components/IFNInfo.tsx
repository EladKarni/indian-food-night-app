"use client";

import { useActiveEvent } from "@/hooks/useActiveEvent";
import { useHostProfile } from "@/hooks/useHostProfile";
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

export default function IFNInfo({ className }: UserInfoProps) {
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

  const googleMapsUrl = address 
    ? `https://www.google.com/maps?q=${encodeURIComponent(address)}`
    : null;

  // Generate restaurant menu search URL
  const menuUrl = `https://www.google.com/search?q=${encodeURIComponent(restaurant + " menu")}`;

  const handleNavigate = () => {
    if (isOrderPage) {
      window.open(menuUrl, '_blank');
    } else if (googleMapsUrl) {
      window.open(googleMapsUrl, '_blank');
    }
  };

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
          <div className="w-4 h-4 bg-blue-600 rounded-sm flex items-center justify-center mr-3">
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

      {(isOrderPage || address) && (
        <button
          onClick={handleNavigate}
          className={`w-10 h-10 ${
            isOrderPage 
              ? "bg-orange-600 hover:bg-orange-700" 
              : "bg-green-600 hover:bg-green-700"
          } rounded-full flex items-center justify-center ml-4 transition-colors duration-200 shadow-sm hover:shadow-md`}
          title={isOrderPage ? "View restaurant menu" : "Navigate to location"}
        >
          <span className="text-white text-lg">
            {isOrderPage ? "🍽️" : "🚗"}
          </span>
        </button>
      )}
    </div>
  );
}
