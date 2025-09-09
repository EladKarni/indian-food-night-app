"use client";

import { useAuth } from "@/contexts/AuthContext";

interface UserInfoProps {
  showProfilePicture?: boolean;
  className?: string;
}

export default function UserInfo({ 
  showProfilePicture = true, 
  className = "" 
}: UserInfoProps) {
  const { user } = useAuth();

  return (
    <div className={`flex items-center ${className}`}>
      <div className="flex-1">
        <div className="flex items-center mb-1">
          <div className="w-4 h-4 bg-blue-600 rounded-sm flex items-center justify-center mr-2">
            <span className="text-white text-xs">👤</span>
          </div>
          <span className="font-semibold text-slate-800 text-sm">
            {user?.user_metadata?.full_name || user?.email || "Guest"}
          </span>
        </div>
        <div className="flex items-center text-xs text-slate-700">
          <div className="w-4 h-4 bg-blue-600 rounded-sm flex items-center justify-center mr-2">
            <span className="text-white text-xs">🏠</span>
          </div>
          <span>{user?.user_metadata?.address || "Address not provided"} @ 6:30</span>
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