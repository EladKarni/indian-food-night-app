"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useActiveEvent } from "@/hooks/useActiveEvent";
import { useOrders } from "@/hooks/useOrders";
import Link from "next/link";

export default function DashboardContent() {
  const { user } = useAuth();
  const { activeEvent } = useActiveEvent();
  const { orders } = useOrders(activeEvent?.id);

  const eventStatusButton = () => {
    if (activeEvent) {
      return (
        <Link
          href="/order"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-2xl transition-colors text-sm"
        >
          🎉 View Events
        </Link>
      );
    }
    return (
      <Link
        href="/create-event"
        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-2xl transition-colors text-sm"
      >
        📅 Host Event
      </Link>
    );
  };

  const overviewButton = () => {
    // Show overview button only if there's an active event and it has more than one order
    if (activeEvent && orders.length > 1) {
      return (
        <Link
          href="/order-overview"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-2xl transition-colors text-sm"
        >
          📋 View Order Overview
        </Link>
      );
    }
    return null;
  };

  if (!user) return null;

  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-orange-200 via-rose-300 to-slate-500 flex items-center justify-center p-4">
        <div className="w-full max-w-xs mx-auto bg-gradient-to-b from-orange-300 to-orange-200 rounded-3xl overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="bg-orange-400 text-center py-3 px-4 relative">
            <h1 className="text-xs font-medium text-slate-700 leading-tight">
              Welcome back, {user.user_metadata.full_name}!
            </h1>
          </div>

          <div className="p-6">
            {/* User Info */}
            <div className="mb-8">
              <div className="text-center">
                <h2 className="text-lg font-bold text-slate-800 mb-4">
                  Dashboard
                </h2>

                {/* Action Buttons */}
                <div className="space-y-3 mb-6 flex flex-col items-center">
                  {eventStatusButton()}
                  {overviewButton()}
                  <Link
                    href="/profile/edit"
                    className="w-full bg-slate-600 hover:bg-slate-700 text-white font-medium py-3 px-4 rounded-2xl transition-colors text-sm"
                  >
                    👤 Edit Profile
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
