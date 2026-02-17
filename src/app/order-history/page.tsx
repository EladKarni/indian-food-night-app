"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { usePastEvents } from "@/hooks/usePastEvents";
import { useActiveEvent } from "@/hooks/useActiveEvent";
import { useAuth } from "@/contexts/AuthContext";
import PastEventCard from "@/components/PastEventCard";
import { bulkReorderUtil } from "@/util/reorderUtils";
import Button from "@/ui/button";
import Link from "next/link";

function OrderHistoryContent() {
  const { pastEvents, loading, error } = usePastEvents();
  const { activeEvent } = useActiveEvent();
  const { user } = useAuth();
  const handleReorder = async (eventId: string, orderIds?: string[]) => {
    if (!activeEvent) {
      alert("No active event available for ordering.");
      return;
    }

    if (!user) {
      alert("You must be logged in to re-order.");
      return;
    }

    try {
      const pastEvent = pastEvents.find(e => e.id === eventId);
      if (!pastEvent) {
        throw new Error("Event not found");
      }

      await bulkReorderUtil({
        user,
        targetEventId: activeEvent.id,
        sourceOrders: pastEvent.orders,
        selectedOrderIds: orderIds,
      });

      alert("Items re-ordered successfully! Redirecting to order page...");
      window.location.href = "/order";
    } catch (err) {
      console.error("Re-order failed:", err);
      alert(err instanceof Error ? err.message : "Failed to re-order items");
    }
  };

  const handleViewDetails = (_eventId: string) => {
    // For now, just expand the card
    // Could navigate to dedicated event detail page in future
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-orange-200 via-rose-300 to-slate-500 flex items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto bg-gradient-to-b from-orange-300 to-orange-200 rounded-3xl overflow-hidden shadow-2xl p-6">
          <div className="text-center">
            <div className="loading loading-spinner loading-md mb-4"></div>
            <p className="text-slate-700">Loading your order history...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-200 via-rose-300 to-slate-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto bg-gradient-to-b from-orange-300 to-orange-200 rounded-3xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-orange-400 text-center py-3 px-4 relative">
          <h1 className="text-xs font-medium text-slate-700 leading-tight">
            Your Order History
          </h1>
        </div>

        <div className="p-6">
          {/* Active Event Status */}
          {activeEvent ? (
            <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded-xl text-xs text-green-800">
              <span className="font-semibold">✓ Active Event:</span> You can re-order items to the upcoming event.
            </div>
          ) : (
            <div className="mb-4 p-3 bg-amber-100 border border-amber-300 rounded-xl text-xs text-amber-800">
              <span className="font-semibold">⏳ No Active Event:</span> Re-ordering is disabled until the next event is scheduled.
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-xl text-xs text-red-800">
              {error}
            </div>
          )}

          {/* Empty State */}
          {pastEvents.length === 0 && !error && (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">📦</div>
              <p className="text-slate-700 font-medium mb-2">No Past Orders</p>
              <p className="text-slate-600 text-sm mb-6">
                You haven&apos;t placed any orders yet.
              </p>
              <Link href="/order">
                <Button variant="primary" size="md">
                  Place Your First Order
                </Button>
              </Link>
            </div>
          )}

          {/* Past Events List */}
          {pastEvents.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-slate-800 mb-3">
                Past Events ({pastEvents.length})
              </h2>
              {pastEvents.map((event) => (
                <PastEventCard
                  key={event.id}
                  event={event}
                  onReorder={handleReorder}
                  onViewDetails={handleViewDetails}
                  hasActiveEvent={!!activeEvent}
                />
              ))}
            </div>
          )}

          {/* Back to Dashboard */}
          <div className="mt-6 pt-4 border-t border-slate-400/20">
            <Link href="/dashboard">
              <Button
                fullWidth
                variant="secondary"
                size="md"
                className="bg-slate-600 hover:bg-slate-700"
              >
                ← Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function OrderHistoryPage() {
  return (
    <ProtectedRoute>
      <OrderHistoryContent />
    </ProtectedRoute>
  );
}
