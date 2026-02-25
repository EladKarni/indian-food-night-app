"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useActiveEvent } from "@/hooks/useActiveEvent";
import { useOrders } from "@/hooks/useOrders";
import Link from "next/link";
import EventStatusButton from "@/components/dashboard/EventStatusButton";
import EditEventButton from "@/components/dashboard/EditEventButton";
import DeleteEventButton from "@/components/dashboard/DeleteEventButton";
import OverviewButton from "@/components/dashboard/OverviewButton";

export default function DashboardContent() {
  const { user } = useAuth();
  const { activeEvent, refreshActiveEvent } = useActiveEvent();
  const { orders } = useOrders(activeEvent?.id);

  // Check if current user is the host of the active event
  const isHost = user && activeEvent && activeEvent.host_id === user.id;

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
                  <EventStatusButton event={activeEvent} />
                  {isHost && activeEvent && <EditEventButton eventId={activeEvent.id} />}
                  {isHost && activeEvent && <DeleteEventButton eventId={activeEvent.id} userId={user.id} onDeleted={refreshActiveEvent} />}
                  {activeEvent && orders.length > 1 && <OverviewButton />}
                  <Link
                    href="/order-history"
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-2xl transition-colors text-sm"
                  >
                    📜 Order History
                  </Link>
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
