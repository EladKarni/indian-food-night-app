"use client";

import { useState } from "react";
import { useOrders, OrderWithMenuItem } from "@/hooks/useOrders";
import { useActiveEvent } from "@/hooks/useActiveEvent";
import { useAuth } from "@/contexts/AuthContext";
import { useGuestName } from "@/hooks/useGuestName";
import { useHostProfile } from "@/hooks/useHostProfile";
import OrderListItem from "./orders/OrderListItem";
import OrderListTotals from "./orders/OrderListTotals";
import OrderListSkeleton from "./orders/OrderListSkeleton";

interface OrderListProps {
  showAllOrders?: boolean;
  isOverviewPage?: boolean;
  isHostView?: boolean;
  orders?: OrderWithMenuItem[];
  loading?: boolean;
  error?: string | null;
}

export const OrderList = ({
  showAllOrders = false,
  isOverviewPage = false,
  isHostView = false,
  orders: propOrders,
  loading: propLoading,
  error: propError,
}: OrderListProps) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const { activeEvent } = useActiveEvent();
  const hookResult = useOrders(activeEvent?.id);
  const { user } = useAuth();
  const { guestName } = useGuestName();
  const { hostProfile } = useHostProfile(activeEvent?.host_id || undefined);

  const orders = propOrders ?? hookResult.orders;
  const loading = propLoading ?? hookResult.loading;
  const error = propError ?? hookResult.error;
  const { addOrder, removeOrder, updateOrder } = hookResult;

  const currentUserName =
    user?.user_metadata?.full_name || user?.email || guestName;

  const shouldShowAllOrders = showAllOrders;

  const handleRemoveOrder = async (orderId: string) => {
    try {
      await removeOrder(orderId);
    } catch (e) {
      console.error("Failed to remove order:", e);
    }
  };

  const handleDuplicateOrder = async (order: OrderWithMenuItem) => {
    if (!activeEvent) {
      console.error("Missing active event");
      return;
    }
    try {
      await addOrder(
        {
          menu_item_id: order.menu_item_id,
          event_id: order.event_id,
          spice_level: order.spice_level,
          is_indian_hot: order.is_indian_hot,
          special_instructions: order.special_instructions,
        },
        guestName
      );
    } catch (e) {
      console.error("Failed to duplicate order:", e);
    }
  };

  const handleEditOrder = async (
    orderId: string,
    updates: {
      spice_level?: number;
      is_indian_hot?: boolean;
      special_instructions?: string | null;
    }
  ): Promise<void> => {
    try {
      await updateOrder(orderId, updates);
    } catch (e) {
      console.error("Failed to update order:", e);
      throw e;
    }
  };

  const handleToggleSubmitted = async (
    orderId: string,
    isSubmitted: boolean
  ) => {
    try {
      await updateOrder(orderId, { is_submitted: isSubmitted });
    } catch (e) {
      console.error("Failed to update order status:", e);
    }
  };

  if (loading) {
    return (
      <OrderListSkeleton
        showAllOrders={shouldShowAllOrders}
        isOverviewPage={isOverviewPage}
      />
    );
  }

  if (error) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "16px 0",
          color: "var(--ifn-chili)",
          fontSize: 12,
        }}
      >
        {error}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "16px 0",
          color: "var(--ifn-muted)",
          fontSize: 13,
        }}
      >
        No orders yet
      </div>
    );
  }

  const filteredOrders = shouldShowAllOrders
    ? orders
    : orders.filter((order) => order.user_name === currentUserName);

  const ordersByUser = filteredOrders.reduce((acc, order) => {
    const userName = order.user_name || "Unknown User";
    if (!acc[userName]) {
      acc[userName] = [];
    }
    acc[userName].push(order);
    return acc;
  }, {} as Record<string, OrderWithMenuItem[]>);

  const runningTotal = filteredOrders.reduce(
    (sum, o) => sum + o.menu_items.price,
    0
  );

  return (
    <div>
      {Object.keys(ordersByUser).length !== 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <div className="ifn-display" style={{ fontSize: 22 }}>
            {shouldShowAllOrders ? "All orders" : "Your order"}
          </div>
          {isHostView && isOverviewPage ? (
            <button
              type="button"
              onClick={() => setIsEditMode(!isEditMode)}
              className={
                isEditMode ? "ifn-pill ifn-pill--accent" : "ifn-pill"
              }
              style={{ border: 0, cursor: "pointer", fontSize: 11 }}
            >
              {isEditMode ? "Done editing" : "Edit status"}
            </button>
          ) : (
            <div
              className="ifn-num"
              style={{ fontSize: 12.5, color: "var(--ifn-muted)" }}
            >
              {filteredOrders.length}{" "}
              {filteredOrders.length === 1 ? "item" : "items"}
            </div>
          )}
        </div>
      )}

      {Object.entries(ordersByUser).map(([userName, userOrders]) => {
        const isCurrentUser = userName === currentUserName;
        const userOrdersForCalculation = isHostView
          ? userOrders.filter((o) => o.is_submitted)
          : userOrders;
        const userTotal = userOrdersForCalculation.reduce(
          (sum, o) => sum + o.menu_items.price,
          0
        );

        return (
          <div key={userName} style={{ marginBottom: 16 }}>
            {(shouldShowAllOrders || isOverviewPage) && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    fontSize: 13.5,
                    fontWeight: 500,
                    color: isCurrentUser
                      ? "var(--ifn-primary)"
                      : "var(--ifn-ink)",
                  }}
                >
                  {isCurrentUser ? `${userName} · you` : userName}
                </div>
                {isOverviewPage && (
                  <div
                    className="ifn-num"
                    style={{ fontSize: 12, color: "var(--ifn-muted)" }}
                  >
                    ${userTotal.toFixed(2)}
                  </div>
                )}
              </div>
            )}
            <div className="ifn-card" style={{ overflow: "hidden" }}>
              {userOrders.map((order, idx) => (
                <OrderListItem
                  key={order.id}
                  order={order}
                  onRemove={handleRemoveOrder}
                  onDuplicate={handleDuplicateOrder}
                  onEdit={handleEditOrder}
                  onToggleSubmitted={handleToggleSubmitted}
                  isOverviewPage={isOverviewPage}
                  isHostView={isHostView}
                  isEditMode={isEditMode}
                  hideDivider={idx === userOrders.length - 1}
                />
              ))}
            </div>
          </div>
        );
      })}

      {!isOverviewPage && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 16,
          }}
        >
          <span style={{ fontSize: 13, color: "var(--ifn-muted)" }}>
            Running total
          </span>
          <span
            className="ifn-num ifn-display"
            style={{ fontSize: 24 }}
          >
            ${runningTotal.toFixed(2)}
          </span>
        </div>
      )}

      {isOverviewPage && (
        <OrderListTotals
          orders={filteredOrders}
          isHostView={isHostView}
          shouldShowAllOrders={shouldShowAllOrders}
          hostVenmoUsername={hostProfile?.venmo_username || null}
          hostName={hostProfile?.full_name || null}
          eventDate={activeEvent?.event_date || null}
        />
      )}
    </div>
  );
};

export default OrderList;
