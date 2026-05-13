"use client";

import { Suspense, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useActiveEvent } from "@/hooks/useActiveEvent";
import { useOrders, OrderWithMenuItem } from "@/hooks/useOrders";
import { useHostProfile } from "@/hooks/useHostProfile";
import ProtectedRoute from "@/components/ProtectedRoute";
import SpiceDots from "@/ui/SpiceDots";

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

const PhoneIcon = (props: { color?: string }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path
      d="M5 5.5C5 4.7 5.7 4 6.5 4h2c.8 0 1.5.7 1.5 1.5 0 1.3.2 2.5.6 3.6.2.5 0 1.1-.4 1.5l-1.4 1.4a14 14 0 006.3 6.3l1.4-1.4c.4-.4 1-.6 1.5-.4 1.1.4 2.3.6 3.6.6.8 0 1.5.7 1.5 1.5v2c0 .8-.7 1.5-1.5 1.5C11.5 22 2 12.5 2 6.5 2 5.7 2.7 5 3.5 5H5"
      stroke={props.color || "#fff"}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

interface GroupedOrder {
  item_name: string;
  price: number;
  spice_levels: { [key: string]: number };
  total_quantity: number;
  total_cost: number;
  indian_hot_count: number;
}

function OrderModePageContent() {
  const router = useRouter();
  const { user } = useAuth();
  const { activeEvent } = useActiveEvent();
  const { orders, loading, error } = useOrders(activeEvent?.id);
  const { hostProfile } = useHostProfile(activeEvent?.host_id ?? undefined);

  const isHost = !!user && !!activeEvent && activeEvent.host_id === user.id;

  const submittedOrders = useMemo(
    () => orders.filter((order) => order.is_submitted),
    [orders]
  );

  const groupedOrders = useMemo(() => {
    const groups: { [key: string]: GroupedOrder } = {};
    submittedOrders.forEach((order: OrderWithMenuItem) => {
      const itemName = order.menu_items.name;
      const spiceLevel = order.spice_level?.toString() || "0";
      if (!groups[itemName]) {
        groups[itemName] = {
          item_name: itemName,
          price: order.menu_items.price,
          spice_levels: {},
          total_quantity: 0,
          total_cost: 0,
          indian_hot_count: 0,
        };
      }
      groups[itemName].spice_levels[spiceLevel] =
        (groups[itemName].spice_levels[spiceLevel] || 0) + 1;
      groups[itemName].total_quantity += 1;
      groups[itemName].total_cost += order.menu_items.price;
      if (order.is_indian_hot) {
        groups[itemName].indian_hot_count += 1;
      }
    });
    return Object.values(groups).sort((a, b) =>
      a.item_name.localeCompare(b.item_name)
    );
  }, [submittedOrders]);

  const uniqueUsers = useMemo(() => {
    const userNames = new Set(submittedOrders.map((o) => o.user_name));
    return userNames.size;
  }, [submittedOrders]);

  useEffect(() => {
    if (!isHost && activeEvent) {
      router.push("/order-overview");
    }
  }, [isHost, activeEvent, router]);

  if (!isHost) {
    return null;
  }

  const sub = submittedOrders.reduce((s, o) => s + o.menu_items.price, 0);
  const tax = sub * 0.07;
  const total = sub + tax;

  const restaurant = activeEvent?.restaurant || "Coriander Grill";
  const phone = "(415) 555-0142";

  return (
    <main className="ifn-screen ifn-app">
      <div style={{ maxWidth: 420, margin: "0 auto", width: "100%", flex: 1 }}>
        <div className="ifn-topbar">
          <button
            type="button"
            onClick={() => router.push("/order-overview")}
            className="ifn-topbar-btn"
            style={{ cursor: "pointer" }}
          >
            <BackIcon />
          </button>
          <div style={{ textAlign: "center", flex: 1 }}>
            <div
              className="ifn-eyebrow"
              style={{ fontSize: 10, marginBottom: 2 }}
            >
              On the phone
            </div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: "-0.01em",
              }}
            >
              Order script
            </div>
          </div>
          <span style={{ width: 38, height: 38 }} />
        </div>

        <div className="ifn-screen-pad" style={{ paddingTop: 4 }}>
          {loading ? (
            <div
              style={{
                textAlign: "center",
                padding: "32px 0",
                color: "var(--ifn-muted)",
                fontSize: 13,
              }}
            >
              Loading orders…
            </div>
          ) : error ? (
            <div
              style={{
                textAlign: "center",
                padding: "16px 0",
                color: "var(--ifn-chili)",
                fontSize: 13,
              }}
            >
              {error}
            </div>
          ) : (
            <>
              {/* Phone callout */}
              <div
                className="ifn-card"
                style={{
                  padding: 14,
                  marginBottom: 16,
                  background: "var(--ifn-primary-soft)",
                  borderColor: "transparent",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      background: "var(--ifn-primary)",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <PhoneIcon />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: 13.5,
                        fontWeight: 500,
                        color: "var(--ifn-ink)",
                      }}
                    >
                      {restaurant}
                    </div>
                    <div
                      className="ifn-num"
                      style={{ fontSize: 12, color: "var(--ifn-ink-2)" }}
                    >
                      {phone}
                    </div>
                  </div>
                  <a
                    href={`tel:${phone.replace(/[^0-9]/g, "")}`}
                    className="ifn-btn ifn-btn--primary"
                    style={{
                      padding: "8px 14px",
                      fontSize: 13,
                      textDecoration: "none",
                    }}
                  >
                    Call
                  </a>
                </div>
              </div>

              {uniqueUsers > 2 && (
                <div
                  style={{
                    padding: "10px 14px",
                    borderRadius: 12,
                    background: "var(--ifn-surface-2)",
                    marginBottom: 16,
                    fontSize: 12.5,
                    color: "var(--ifn-ink-2)",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "var(--ifn-amber)",
                    }}
                  />
                  {uniqueUsers} people tonight — ask for an extra side of rice.
                </div>
              )}

              {groupedOrders.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "32px 0",
                    color: "var(--ifn-muted)",
                    fontSize: 13,
                  }}
                >
                  No submitted orders yet.
                </div>
              ) : (
                <>
                  {groupedOrders.map((g) => {
                    const spices = Object.entries(g.spice_levels)
                      .map(([lvl, count]) => ({
                        lvl: parseInt(lvl, 10),
                        count,
                      }))
                      .filter((s) => s.lvl > 0)
                      .sort((a, b) => a.lvl - b.lvl);
                    return (
                      <div
                        key={g.item_name}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 14,
                          padding: "14px 0",
                          borderBottom: "1px solid var(--ifn-border)",
                        }}
                      >
                        <div
                          className="ifn-num ifn-display"
                          style={{
                            fontSize: 32,
                            width: 44,
                            color: "var(--ifn-primary)",
                            lineHeight: 1,
                          }}
                        >
                          {g.total_quantity}
                          <span
                            style={{
                              fontSize: 14,
                              color: "var(--ifn-muted)",
                            }}
                          >
                            ×
                          </span>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 15, fontWeight: 500 }}>
                            {g.item_name}
                          </div>
                          {(spices.length > 0 || g.indian_hot_count > 0) && (
                            <div
                              style={{
                                fontSize: 12,
                                color: "var(--ifn-muted)",
                                marginTop: 4,
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 8,
                              }}
                            >
                              {spices.map((s) => {
                                // If this is level 10, subtract Indian-hot count
                                const visibleCount =
                                  s.lvl === 10
                                    ? s.count - g.indian_hot_count
                                    : s.count;
                                if (visibleCount <= 0) return null;
                                return (
                                  <span
                                    key={s.lvl}
                                    style={{
                                      display: "inline-flex",
                                      alignItems: "center",
                                      gap: 5,
                                    }}
                                  >
                                    <SpiceDots level={s.lvl} />
                                    <span>
                                      {visibleCount}× lvl {s.lvl}
                                    </span>
                                  </span>
                                );
                              })}
                              {g.indian_hot_count > 0 && (
                                <span
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 5,
                                    color: "var(--ifn-chili)",
                                  }}
                                >
                                  <SpiceDots level={10} />
                                  <span>
                                    {g.indian_hot_count}× Indian hot
                                  </span>
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        <div
                          className="ifn-num"
                          style={{ fontSize: 13, color: "var(--ifn-muted)" }}
                        >
                          ${(g.price * g.total_quantity).toFixed(2)}
                        </div>
                      </div>
                    );
                  })}

                  <div
                    className="ifn-num"
                    style={{
                      marginTop: 16,
                      fontSize: 13,
                      color: "var(--ifn-muted)",
                      display: "flex",
                      flexDirection: "column",
                      gap: 6,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>Subtotal · {submittedOrders.length} items</span>
                      <span>${sub.toFixed(2)}</span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>Tax (7%)</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                  </div>
                  <div
                    className="ifn-display ifn-num"
                    style={{
                      marginTop: 12,
                      paddingTop: 14,
                      borderTop: "1px solid var(--ifn-border)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                    }}
                  >
                    <span style={{ fontSize: 18, color: "var(--ifn-ink-2)" }}>
                      Total
                    </span>
                    <span style={{ fontSize: 36 }}>${total.toFixed(2)}</span>
                  </div>
                </>
              )}

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  marginTop: 24,
                }}
              >
                <Link
                  href="/order-overview"
                  className="ifn-btn ifn-btn--ghost ifn-btn--full"
                  style={{ textDecoration: "none" }}
                >
                  Back to overview
                </Link>
                <Link
                  href="/dashboard"
                  className="ifn-btn ifn-btn--soft ifn-btn--full"
                  style={{ textDecoration: "none" }}
                >
                  Back to dashboard
                </Link>
              </div>
            </>
          )}
          {hostProfile && null}
        </div>
      </div>
    </main>
  );
}

export default function OrderModePage() {
  return (
    <ProtectedRoute>
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
        <OrderModePageContent />
      </Suspense>
    </ProtectedRoute>
  );
}
