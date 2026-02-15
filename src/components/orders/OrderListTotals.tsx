"use client";

import { OrderWithMenuItem } from "@/hooks/useOrders";

interface OrderListTotalsProps {
  orders: OrderWithMenuItem[];
  isHostView: boolean;
  shouldShowAllOrders: boolean;
}

export default function OrderListTotals({
  orders,
  isHostView,
  shouldShowAllOrders,
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
          ${(total * 1.07).toFixed(2)}
        </span>
      </div>
    </div>
  );
}
