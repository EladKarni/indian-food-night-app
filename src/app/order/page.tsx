"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import EventInfo from "@/components/EventInfo";
import OrderItem from "@/components/OrderItem";
import OrderList from "@/components/OrderList";
import { CutoffWarningBanner } from "@/components/CutoffWarningBanner";
import { useOrders } from "@/hooks/useOrders";
import { useActiveEvent } from "@/hooks/useActiveEvent";
import { useAuth } from "@/contexts/AuthContext";
import { useGuestName } from "@/hooks/useGuestName";
import { useHostProfile } from "@/hooks/useHostProfile";
import { calculateCutoffStatus, formatCutoffTime } from "@/util/cutoffUtil";

const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path
      d="M15 6l-6 6 6 6"
      stroke="var(--ifn-ink-2)"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const MoreIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="5" cy="12" r="1.4" fill="var(--ifn-ink-2)" />
    <circle cx="12" cy="12" r="1.4" fill="var(--ifn-ink-2)" />
    <circle cx="19" cy="12" r="1.4" fill="var(--ifn-ink-2)" />
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path
      d="M5 12.5l4.5 4.5L19 7"
      stroke="#fff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

function OrderPageContent() {
  const { activeEvent } = useActiveEvent();
  const { orders, loading, error, refetch, updateOrder } = useOrders(
    activeEvent?.id
  );
  const { user } = useAuth();
  const { guestName } = useGuestName();
  const { hostProfile } = useHostProfile(activeEvent?.host_id ?? undefined);
  const [finalizing, setFinalizing] = useState(false);

  const cutoffStatus = calculateCutoffStatus(activeEvent);

  const currentUserName =
    user?.user_metadata?.full_name || user?.email || guestName;
  const userOrders = orders.filter(
    (order) => order.user_name === currentUserName
  );

  const allOrdersSubmitted =
    userOrders.length > 0 && userOrders.every((order) => order.is_submitted);

  const restaurant =
    activeEvent?.restaurant || "Coriander Indian Grill";

  return (
    <main className="ifn-screen ifn-app">
      <div style={{ maxWidth: 420, margin: "0 auto", width: "100%", flex: 1 }}>
        <div className="ifn-topbar">
          <Link
            href="/dashboard"
            className="ifn-topbar-btn"
            style={{ textDecoration: "none" }}
          >
            <BackIcon />
          </Link>
          <div style={{ textAlign: "center", flex: 1 }}>
            <div
              className="ifn-eyebrow"
              style={{ fontSize: 10, marginBottom: 2 }}
            >
              Ordering from
            </div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: "-0.01em",
              }}
            >
              {restaurant}
            </div>
          </div>
          <span className="ifn-topbar-btn">
            <MoreIcon />
          </span>
        </div>

        <div className="ifn-screen-pad" style={{ paddingTop: 4 }}>
          <EventInfo />

          {cutoffStatus?.isPastCutoff && cutoffStatus.cutoffDateTime && (
            <CutoffWarningBanner
              hostName={
                hostProfile?.full_name || hostProfile?.email || "the host"
              }
              cutoffTime={formatCutoffTime(cutoffStatus.cutoffDateTime)}
            />
          )}

          <OrderItem onOrderAdded={refetch} />

          <OrderList orders={orders} loading={loading} error={error} />

          {loading ? (
            <div style={{ marginTop: 16 }}>
              <div className="ifn-skel" style={{ height: 48, borderRadius: 14 }} />
            </div>
          ) : userOrders.length > 0 ? (
            <button
              type="button"
              className="ifn-btn ifn-btn--primary ifn-btn--full"
              style={{ marginTop: 16 }}
              disabled={finalizing}
              onClick={async () => {
                if (allOrdersSubmitted) {
                  window.location.href = "/order-overview";
                } else {
                  setFinalizing(true);
                  try {
                    const updatePromises = userOrders.map((order) =>
                      updateOrder(order.id, { is_submitted: true })
                    );
                    await Promise.all(updatePromises);
                    window.location.href = "/order-overview";
                  } catch (err) {
                    console.error("Failed to finalize orders:", err);
                    alert("Failed to finalize orders. Please try again.");
                    setFinalizing(false);
                  }
                }
              }}
            >
              <CheckIcon />
              {finalizing
                ? "Finalizing…"
                : allOrdersSubmitted
                ? "Order overview"
                : "Finalize my order"}
            </button>
          ) : null}
        </div>
      </div>
    </main>
  );
}

export default function OrderPage() {
  return (
    <Suspense
      fallback={
        <main className="ifn-screen ifn-app">
          <div
            style={{
              maxWidth: 420,
              margin: "0 auto",
              width: "100%",
              padding: "60px 24px",
              textAlign: "center",
            }}
          >
            <div className="ifn-display" style={{ fontSize: 22 }}>
              Loading…
            </div>
          </div>
        </main>
      }
    >
      <OrderPageContent />
    </Suspense>
  );
}
