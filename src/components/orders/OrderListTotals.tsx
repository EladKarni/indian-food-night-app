"use client";

import { OrderWithMenuItem } from "@/hooks/useOrders";
import VenmoPayCard from "./VenmoPayCard";
import PaidConfirmationCard from "./PaidConfirmationCard";

interface OrderListTotalsProps {
  orders: OrderWithMenuItem[];
  isHostView: boolean;
  shouldShowAllOrders: boolean;
  hostVenmoUsername?: string | null;
  hostName?: string | null;
  eventDate?: string | null;
}

function formatMemoDate(eventDate: string | null | undefined) {
  if (!eventDate) return null;
  const [y, m, d] = eventDate.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function OrderListTotals({
  orders,
  isHostView,
  shouldShowAllOrders,
  hostVenmoUsername,
  hostName,
  eventDate,
}: OrderListTotalsProps) {
  const ordersForCalculation = isHostView
    ? orders.filter((order) => order.is_submitted)
    : orders;

  const sub = ordersForCalculation.reduce(
    (sum, order) => sum + order.menu_items.price,
    0
  );

  if (orders.length === 0) {
    return null;
  }

  const tax = sub * 0.07;
  const total = sub + tax;
  const handle = hostVenmoUsername?.trim().replace(/^@/, "");
  const isGuestFullyPaid =
    !isHostView &&
    ordersForCalculation.length > 0 &&
    ordersForCalculation.every((o) => o.is_paid);
  const showVenmoCard =
    !isHostView && !!handle && total > 0 && !isGuestFullyPaid;
  const showPaidCard = isGuestFullyPaid && total > 0;
  const memoDate = formatMemoDate(eventDate);
  const memo = memoDate ? `IFN · ${memoDate}` : "Indian Food Night";

  return (
    <div style={{ marginTop: 14 }}>
      <hr className="ifn-hr" style={{ margin: "12px 0" }} />
      <div
        className="ifn-num"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 6,
          fontSize: 13,
          color: "var(--ifn-muted)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>{shouldShowAllOrders ? "Group subtotal" : "Subtotal"}</span>
          <span>${sub.toFixed(2)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Tax (7%)</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            color: "var(--ifn-ink)",
            fontWeight: 600,
            fontSize: 15,
            marginTop: 6,
          }}
        >
          <span>{shouldShowAllOrders ? "Group total" : "Your share"}</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      {showPaidCard && (
        <PaidConfirmationCard amount={total} hostName={hostName} />
      )}

      {showVenmoCard && handle && (
        <VenmoPayCard
          amount={total}
          hostName={hostName}
          hostVenmoUsername={handle}
          memo={memo}
        />
      )}
    </div>
  );
}
