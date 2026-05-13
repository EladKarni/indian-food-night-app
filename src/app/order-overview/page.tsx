"use client";

import { Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import EventInfo from "@/components/EventInfo";
import OrderList from "@/components/OrderList";
import VenmoCollectionStrip from "@/components/orders/VenmoCollectionStrip";
import { useAuth } from "@/contexts/AuthContext";
import { useActiveEvent } from "@/hooks/useActiveEvent";
import { useOrders } from "@/hooks/useOrders";
import { useHostProfile } from "@/hooks/useHostProfile";

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

const CheckIcon = (props: { color?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path
      d="M5 12.5l4.5 4.5L19 7"
      stroke={props.color || "var(--ifn-primary)"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PhoneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path
      d="M5 5.5C5 4.7 5.7 4 6.5 4h2c.8 0 1.5.7 1.5 1.5 0 1.3.2 2.5.6 3.6.2.5 0 1.1-.4 1.5l-1.4 1.4a14 14 0 006.3 6.3l1.4-1.4c.4-.4 1-.6 1.5-.4 1.1.4 2.3.6 3.6.6.8 0 1.5.7 1.5 1.5v2c0 .8-.7 1.5-1.5 1.5C11.5 22 2 12.5 2 6.5 2 5.7 2.7 5 3.5 5H5"
      stroke="#fff"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

function formatEventLabel(dateStr: string | undefined, time: string | null | undefined) {
  if (!dateStr) return null;
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  const date = dt.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  if (!time) return date;
  const [hRaw, mRaw] = time.split(":");
  const h = parseInt(hRaw, 10);
  const mer = h >= 12 ? "PM" : "AM";
  const h12 = ((h + 11) % 12) + 1;
  return `${date} · ${h12}:${mRaw} ${mer}`;
}

function OrderOverviewPageContent() {
  const router = useRouter();
  const { user } = useAuth();
  const { activeEvent, loading: eventLoading } = useActiveEvent();
  const { orders } = useOrders(activeEvent?.id);

  const isHost = !!user && !!activeEvent && activeEvent.host_id === user.id;
  const { hostProfile } = useHostProfile(activeEvent?.host_id || undefined);

  const hostRunningTotal = orders
    .filter((o) => o.is_submitted)
    .reduce((s, o) => s + o.menu_items.price, 0);
  const submittedUserNames = new Set(
    orders.filter((o) => o.is_submitted).map((o) => o.user_name)
  );
  const totalUserNames = new Set(orders.map((o) => o.user_name));

  const pendingTotal = hostRunningTotal * 1.07;
  const showVenmoStrip =
    isHost && !!hostProfile?.venmo_username && pendingTotal > 0;

  const eventLabel = formatEventLabel(
    activeEvent?.event_date,
    activeEvent?.start_time
  );

  return (
    <main className="ifn-screen ifn-app">
      <div style={{ maxWidth: 420, margin: "0 auto", width: "100%", flex: 1 }}>
        <div className="ifn-topbar">
          <button
            type="button"
            onClick={() => router.push("/order")}
            className="ifn-topbar-btn"
            style={{ cursor: "pointer" }}
          >
            <BackIcon />
          </button>
          <div style={{ textAlign: "center", flex: 1 }}>
            {isHost && eventLabel && (
              <div
                className="ifn-eyebrow"
                style={{ fontSize: 10, marginBottom: 2 }}
              >
                {eventLabel}
              </div>
            )}
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: "-0.01em",
              }}
            >
              {isHost ? "Group order" : "Order placed"}
            </div>
          </div>
          <span className="ifn-topbar-btn">
            <MoreIcon />
          </span>
        </div>

        <div className="ifn-screen-pad" style={{ paddingTop: 8 }}>
          {isHost ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: 16,
                background: "var(--ifn-ink)",
                color: "#fff",
                borderRadius: 18,
                marginBottom: 18,
              }}
            >
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 11,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "#B5AC9E",
                    marginBottom: 4,
                  }}
                >
                  {submittedUserNames.size} of {totalUserNames.size} in
                </div>
                <div
                  className="ifn-display"
                  style={{ fontSize: 22, lineHeight: 1 }}
                >
                  ${hostRunningTotal.toFixed(2)} so far
                </div>
              </div>
              <Link
                href="/order-mode"
                className="ifn-btn ifn-btn--primary"
                style={{
                  padding: "10px 14px",
                  fontSize: 13,
                  textDecoration: "none",
                }}
              >
                <PhoneIcon />
                Call order
              </Link>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 18,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  background: "var(--ifn-primary-soft)",
                  color: "var(--ifn-primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CheckIcon />
              </div>
              <div>
                <div
                  className="ifn-display"
                  style={{ fontSize: 22, lineHeight: 1.05 }}
                >
                  You&apos;re in.
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "var(--ifn-muted)",
                    marginTop: 2,
                  }}
                >
                  {eventLabel
                    ? `See you ${eventLabel.toLowerCase()}.`
                    : "We've got your order."}
                </div>
              </div>
            </div>
          )}

          {showVenmoStrip && (
            <VenmoCollectionStrip collected={0} pending={pendingTotal} />
          )}

          {!isHost && (
            <div style={{ marginBottom: 14 }}>
              <EventInfo />
            </div>
          )}

          {!eventLoading && !isHost && (
            <p
              style={{
                color: "var(--ifn-muted)",
                fontSize: 13,
                fontStyle: "italic",
                marginBottom: 16,
              }}
            >
              You&apos;re all set for IFN. Text the host if anything changes.
            </p>
          )}

          <OrderList
            showAllOrders={isHost || false}
            isOverviewPage={true}
            isHostView={isHost || false}
          />

          <div
            style={{
              display: "flex",
              gap: 10,
              marginTop: 20,
              flexDirection: "column",
            }}
          >
            <button
              type="button"
              className="ifn-btn ifn-btn--ghost ifn-btn--full"
              onClick={() => router.push("/order")}
            >
              Back to order
            </button>
            <button
              type="button"
              className="ifn-btn ifn-btn--soft ifn-btn--full"
              onClick={() => router.push("/dashboard")}
            >
              Back to dashboard
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function OrderOverviewPage() {
  return (
    <Suspense
      fallback={
        <main className="ifn-screen ifn-app">
          <div
            style={{
              maxWidth: 420,
              margin: "0 auto",
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
      <OrderOverviewPageContent />
    </Suspense>
  );
}
