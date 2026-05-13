"use client";

import { OrderWithMenuItem } from "@/hooks/useOrders";
import { sumOrderPrices } from "@/util/orderGrouping";
import OrderListItem from "./OrderListItem";

interface OrderListUserGroupProps {
  userName: string;
  orders: OrderWithMenuItem[];
  isCurrentUser: boolean;
  showHeader: boolean;
  showUserTotal: boolean;
  isHostView: boolean;
  isOverviewPage: boolean;
  isEditMode: boolean;
  onRemove: (orderId: string) => void;
  onDuplicate: (order: OrderWithMenuItem) => void;
  onEdit: (
    orderId: string,
    updates: {
      spice_level?: number;
      is_indian_hot?: boolean;
      special_instructions?: string | null;
    }
  ) => Promise<void>;
  onToggleSubmitted: (orderId: string, isSubmitted: boolean) => void;
}

export default function OrderListUserGroup({
  userName,
  orders,
  isCurrentUser,
  showHeader,
  showUserTotal,
  isHostView,
  isOverviewPage,
  isEditMode,
  onRemove,
  onDuplicate,
  onEdit,
  onToggleSubmitted,
}: OrderListUserGroupProps) {
  // For host views, only count submitted orders toward the user's per-row total.
  const ordersForTotal = isHostView
    ? orders.filter((o) => o.is_submitted)
    : orders;
  const userTotal = sumOrderPrices(ordersForTotal);

  function renderHeader() {
    if (!showHeader) return null;
    return (
      <div className="ifn-row-between" style={{ marginBottom: 8 }}>
        <div
          style={{
            fontSize: 13.5,
            fontWeight: 500,
            color: isCurrentUser ? "var(--ifn-primary)" : "var(--ifn-ink)",
          }}
        >
          {isCurrentUser ? `${userName} · you` : userName}
        </div>
        {showUserTotal && (
          <div
            className="ifn-num"
            style={{ fontSize: 12, color: "var(--ifn-muted)" }}
          >
            ${userTotal.toFixed(2)}
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ marginBottom: 16 }}>
      {renderHeader()}
      <div className="ifn-card" style={{ overflow: "hidden" }}>
        {orders.map((order, idx) => (
          <OrderListItem
            key={order.id}
            order={order}
            onRemove={onRemove}
            onDuplicate={onDuplicate}
            onEdit={onEdit}
            onToggleSubmitted={onToggleSubmitted}
            isOverviewPage={isOverviewPage}
            isHostView={isHostView}
            isEditMode={isEditMode}
            hideDivider={idx === orders.length - 1}
          />
        ))}
      </div>
    </div>
  );
}
