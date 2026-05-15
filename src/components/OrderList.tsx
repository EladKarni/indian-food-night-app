"use client";

import { useState } from "react";
import { useOrders, OrderWithMenuItem } from "@/hooks/useOrders";
import { useActiveEvent } from "@/hooks/useActiveEvent";
import { useAuth } from "@/contexts/AuthContext";
import { useGuestName } from "@/hooks/useGuestName";
import { useHostProfile } from "@/hooks/useHostProfile";
import { useOrderListActions } from "@/hooks/useOrderListActions";
import { groupOrdersByUser, sumOrderPrices } from "@/util/orderGrouping";
import OrderListHeader from "./orders/OrderListHeader";
import OrderListUserGroup from "./orders/OrderListUserGroup";
import OrderListTotals from "./orders/OrderListTotals";
import OrderListSkeleton from "./orders/OrderListSkeleton";
import OrderListRunningTotal from "./orders/OrderListRunningTotal";

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
  const ordersHook = useOrders(activeEvent?.id);
  const { user } = useAuth();
  const { guestName } = useGuestName();
  const { hostProfile } = useHostProfile(activeEvent?.host_id || undefined);

  const orders = propOrders ?? ordersHook.orders;
  const loading = propLoading ?? ordersHook.loading;
  const error = propError ?? ordersHook.error;

  const actions = useOrderListActions({ activeEvent, ordersHook });

  const currentUserName =
    user?.user_metadata?.full_name || user?.email || guestName;

  if (loading) {
    return (
      <OrderListSkeleton
        showAllOrders={showAllOrders}
        isOverviewPage={isOverviewPage}
      />
    );
  }

  if (error) {
    return <div className="ifn-empty ifn-empty--error">{error}</div>;
  }

  if (orders.length === 0) {
    return <div className="ifn-empty">No orders yet</div>;
  }

  const filteredOrders = showAllOrders
    ? orders
    : orders.filter((order) => order.user_name === currentUserName);

  const ordersByUser = groupOrdersByUser(filteredOrders);
  const runningTotal = sumOrderPrices(filteredOrders);

  const showHeader = Object.keys(ordersByUser).length !== 0;
  const showUserGroupHeader = showAllOrders || isOverviewPage;

  function renderHeader() {
    if (!showHeader) return null;
    return (
      <OrderListHeader
        title={showAllOrders ? "All orders" : "Your order"}
        itemCount={filteredOrders.length}
        showEditToggle={isHostView && isOverviewPage}
        isEditMode={isEditMode}
        onToggleEditMode={() => setIsEditMode(!isEditMode)}
      />
    );
  }

  function renderFooterTotals() {
    if (isOverviewPage) {
      return (
        <OrderListTotals
          orders={filteredOrders}
          isHostView={isHostView}
          shouldShowAllOrders={showAllOrders}
          hostVenmoUsername={hostProfile?.venmo_username || null}
          hostName={hostProfile?.full_name || null}
        />
      );
    }
    return <OrderListRunningTotal total={runningTotal} />;
  }

  return (
    <div>
      {renderHeader()}

      {Object.entries(ordersByUser).map(([userName, userOrders]) => (
        <OrderListUserGroup
          key={userName}
          userName={userName}
          orders={userOrders}
          isCurrentUser={userName === currentUserName}
          showHeader={showUserGroupHeader}
          showUserTotal={isOverviewPage}
          isHostView={isHostView}
          isOverviewPage={isOverviewPage}
          isEditMode={isEditMode}
          onRemove={actions.handleRemoveOrder}
          onDuplicate={actions.handleDuplicateOrder}
          onEdit={actions.handleEditOrder}
          onToggleSubmitted={actions.handleToggleSubmitted}
          onTogglePaid={actions.handleToggleAttendeePaid}
        />
      ))}

      {renderFooterTotals()}
    </div>
  );
};

export default OrderList;
