"use client";

import { useActiveEvent } from "@/hooks/useActiveEvent";
import { useHostProfile } from "@/hooks/useHostProfile";

interface UserInfoProps {
  showProfilePicture?: boolean;
  className?: string;
}

export default function IFNInfo({ showProfilePicture = true }: UserInfoProps) {
  const { activeEvent } = useActiveEvent();
  const { hostProfile, loading } = useHostProfile(activeEvent?.host_id);

  if (!activeEvent) {
    return null;
  }

  return (
    <div className={`flex items-center`}>
      <div className="flex-1">
        <div className="flex items-center mb-1">
          <div className="w-4 h-4 bg-blue-600 rounded-sm flex items-center justify-center mr-2">
            <span className="text-white text-xs">👤</span>
          </div>
          <span className="font-semibold text-slate-800 text-sm">
            {loading ? "Loading host..." : (hostProfile?.full_name || hostProfile?.email || "Host")}
          </span>
        </div>
        <div className="flex items-center text-xs text-slate-700">
          <div className="w-4 h-4 bg-blue-600 rounded-sm flex items-center justify-center mr-2">
            <span className="text-white text-xs">🏠</span>
          </div>
          <span>
            {hostProfile?.address || activeEvent?.location || "Address not provided"}
            {activeEvent?.start_time ? ` @ ${activeEvent.start_time}` : " @ 6:30"}
          </span>
        </div>
      </div>
      {showProfilePicture && (
        <div className="w-12 h-12 bg-slate-600 rounded-full flex items-center justify-center ml-4">
          <div className="w-8 h-8 bg-slate-700 rounded-full"></div>
        </div>
      )}
    </div>
  );
}
