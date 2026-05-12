"use client";

import { OrderWithMenuItem } from "@/hooks/useOrders";

interface OrderListTotalsProps {
  orders: OrderWithMenuItem[];
  isHostView: boolean;
  shouldShowAllOrders: boolean;
  hostVenmoUsername?: string | null;
  hostName?: string | null;
}

export default function OrderListTotals({
  orders,
  isHostView,
  shouldShowAllOrders,
  hostVenmoUsername,
  hostName,
}: OrderListTotalsProps) {
  // For hosts, exclude unsubmitted orders from calculation
  const ordersForCalculation = isHostView
    ? orders.filter((order) => order.is_submitted)
    : orders;

  const total = ordersForCalculation.reduce(
    (sum, order) => sum + order.menu_items.price,
    0
  );

  if (orders.length === 0) {
    return null;
  }

  const totalWithTax = total * 1.07;
  const venmoUsername = hostVenmoUsername?.trim().replace(/^@/, "");
  // Only guests paying their own subtotal get the pay link — hosts seeing
  // the group total don't pay themselves.
  const showVenmoLink =
    !isHostView && !!venmoUsername && totalWithTax > 0;

  // venmo:// deep-links open the native app on mobile; the https URL is the
  // fallback for desktop/web, which Venmo handles via its own routing.
  const venmoNote = encodeURIComponent("Indian Food Night");
  const venmoAmount = totalWithTax.toFixed(2);
  const venmoWebUrl = venmoUsername
    ? `https://venmo.com/${venmoUsername}?txn=pay&amount=${venmoAmount}&note=${venmoNote}`
    : "";

  return (
    <div className="mt-4 pt-4 border-t border-slate-300 space-y-2">
      {/* Subtotal */}
      <div className="flex justify-between items-center">
        <span className="text-slate-700">
          {shouldShowAllOrders ? "Group Subtotal:" : "Subtotal:"}
        </span>
        <span className="text-slate-700">${total.toFixed(2)}</span>
      </div>

      {/* Tax (7%) */}
      <div className="flex justify-between items-center">
        <span className="text-slate-700">Tax (7%):</span>
        <span className="text-slate-700">${(total * 0.07).toFixed(2)}</span>
      </div>

      {/* Total with tax */}
      <div className="flex justify-between items-center pt-2 border-t border-slate-200">
        <span className="text-slate-800 font-bold text-lg">
          {shouldShowAllOrders ? "Group Total:" : "Total:"}
        </span>
        <span className="text-slate-800 font-bold text-lg">
          ${totalWithTax.toFixed(2)}
        </span>
      </div>

      {showVenmoLink && (
        <a
          href={venmoWebUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex items-center justify-center gap-2 w-full bg-[#3D95CE] hover:bg-[#327CB0] text-white font-medium py-3 rounded-2xl transition-colors shadow-sm hover:shadow-md"
        >
          <span className="text-lg font-bold">V</span>
          <span>
            Pay {hostName || "host"} ${venmoAmount} on Venmo
          </span>
        </a>
      )}
    </div>
  );
}
