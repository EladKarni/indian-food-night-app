"use client";

import { useState } from "react";
import { HostPastEvent } from "@/hooks/useHostPastEvents";
import { shouldShowSpiceSelector } from "@/util/spiceUtil";

interface HostPastEventCardProps {
  event: HostPastEvent;
}

export default function HostPastEventCard({ event }: HostPastEventCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const eventDate = new Date(event.event_date);
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const grandTotalWithTax = event.grandTotal * 1.07;

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm mb-3">
      {/* Header Section */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <div className="w-4 h-4 bg-orange-600 rounded-sm flex items-center justify-center mr-3">
              <span className="text-white text-xs">📅</span>
            </div>
            <span className="font-semibold text-slate-800 text-sm">
              {formattedDate}
            </span>
            <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
              You hosted
            </span>
          </div>
          <div className="flex items-center text-xs text-slate-600">
            <div className="w-4 h-4 bg-blue-600 rounded-sm flex items-center justify-center mr-3">
              <span className="text-white text-xs">🍽️</span>
            </div>
            <span>{event.restaurant || "Coriander Indian Grill"}</span>
          </div>
        </div>
      </div>

      {/* Summary Row */}
      <div className="flex items-center justify-between mb-3 p-2 bg-slate-50 rounded-xl text-xs text-slate-600">
        <span>{event.attendeeCount} {event.attendeeCount === 1 ? "attendee" : "attendees"}</span>
        <span>·</span>
        <span>{event.totalItems} {event.totalItems === 1 ? "item" : "items"}</span>
        <span>·</span>
        <span className="font-bold text-orange-600">${grandTotalWithTax.toFixed(2)} total</span>
      </div>

      {/* Expand Toggle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-sm text-orange-600 hover:text-orange-700 font-medium text-left"
      >
        {isExpanded ? "▾ Hide Orders" : "▸ Show All Orders"}
      </button>

      {/* Expanded Section */}
      {isExpanded && (
        <div className="pt-3 border-t border-slate-200 mt-3">
          {event.allOrders.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-2">
              No orders were placed for this event.
            </p>
          ) : (
            <div className="space-y-4">
              {event.attendeeGroups.map((group) => (
                <div key={group.displayName}>
                  {/* Person Header */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-700">
                      {group.displayName}
                    </span>
                    <span className="text-xs text-slate-500">
                      ${(group.subtotal * 1.07).toFixed(2)}
                    </span>
                  </div>

                  {/* Orders for this person */}
                  <div className="space-y-1 pl-2">
                    {group.orders.map((order) => (
                      <div key={order.id} className="text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-700">
                            {order.menu_items?.name ?? "Unknown Item"}
                          </span>
                          <div className="flex items-center space-x-2">
                            {order.is_submitted && (
                              <span className="text-green-600">✓</span>
                            )}
                            <span className="text-slate-500">
                              ${(order.menu_items?.price ?? 0).toFixed(2)}
                            </span>
                          </div>
                        </div>

                        {/* Spice info */}
                        {(order.spice_level ?? 0) > 0 && order.menu_items && shouldShowSpiceSelector({
                          id: order.menu_items.id,
                          name: order.menu_items.name,
                          description: order.menu_items.description || "",
                          price: order.menu_items.price,
                          spiceLevel: 0,
                          vegetarian: order.menu_items.is_vegetarian || false,
                          vegan: order.menu_items.is_vegan || false,
                        }) && (
                          <div className="text-slate-400 mt-0.5">
                            Spice: {order.spice_level}{order.is_indian_hot ? ", Indian Hot" : ""}
                          </div>
                        )}

                        {/* Special instructions */}
                        {order.special_instructions && (
                          <div className="text-slate-400 mt-0.5">
                            Note: {order.special_instructions}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Grand Total Footer */}
              <div className="mt-4 pt-3 border-t border-slate-200 space-y-1">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Group Subtotal:</span>
                  <span>${event.grandTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Tax (7%):</span>
                  <span>${(event.grandTotal * 0.07).toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200">
                  <span className="text-sm font-bold text-slate-800">Group Total:</span>
                  <span className="text-sm font-bold text-slate-800">${grandTotalWithTax.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
