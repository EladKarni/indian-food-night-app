"use client";

import { PastEventWithOrders } from "@/hooks/usePastEvents";
import { formatTimeToAMPM } from "@/util/timeUtils";
import Button from "@/ui/button";
import { useState } from "react";

interface PastEventCardProps {
  event: PastEventWithOrders;
  onReorder: (eventId: string, orderIds?: string[]) => void;
  onViewDetails: (eventId: string) => void;
  hasActiveEvent: boolean;
}

export default function PastEventCard({
  event,
  onReorder,
  onViewDetails,
  hasActiveEvent,
}: PastEventCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const eventDate = new Date(event.event_date);
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const handleBulkReorder = () => {
    if (!hasActiveEvent) {
      alert("No active event available. Please wait for the next event to be scheduled.");
      return;
    }
    onReorder(event.id);
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm mb-3">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <div className="w-4 h-4 bg-orange-600 rounded-sm flex items-center justify-center mr-3">
              <span className="text-white text-xs">📅</span>
            </div>
            <span className="font-semibold text-slate-800 text-sm">
              {formattedDate}
            </span>
          </div>
          <div className="flex items-center text-xs text-slate-600">
            <div className="w-4 h-4 bg-blue-600 rounded-sm flex items-center justify-center mr-3">
              <span className="text-white text-xs">🍽️</span>
            </div>
            <span>{event.restaurant || "Coriander Indian Grill"}</span>
          </div>
        </div>

        {/* Summary Badge */}
        <div className="text-right">
          <div className="text-lg font-bold text-orange-600">
            ${event.total_spent.toFixed(2)}
          </div>
          <div className="text-xs text-slate-500">
            {event.order_count} {event.order_count === 1 ? "item" : "items"}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full text-sm text-orange-600 hover:text-orange-700 font-medium text-left"
        >
          {isExpanded ? "▾ Hide Details" : "▸ View Details"}
        </button>

        {isExpanded && (
          <div className="pt-2 border-t border-slate-200">
            {/* Order List */}
            <div className="space-y-1 mb-3">
              {event.orders.map((order) => (
                <div key={order.id} className="flex justify-between text-xs text-slate-700 py-1">
                  <span>{order.menu_items?.name || "Unknown Item"}</span>
                  <span className="font-medium">${order.menu_items?.price.toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Re-order Button */}
            <Button
              fullWidth
              variant="primary"
              size="sm"
              onClick={handleBulkReorder}
              disabled={!hasActiveEvent}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {hasActiveEvent ? "🔄 Re-order All Items" : "⏳ No Active Event"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
