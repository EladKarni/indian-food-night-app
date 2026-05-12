"use client";

import { useState } from "react";
import { useOrders, OrderWithMenuItem } from "@/hooks/useOrders";
import { useActiveEvent } from "@/hooks/useActiveEvent";
import { useAuth } from "@/contexts/AuthContext";
import { useGuestName } from "@/hooks/useGuestName";
import OrderListItem from "./orders/OrderListItem";
import OrderListTotals from "./orders/OrderListTotals";

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
    } catch (error) {
      console.error("Failed to remove order:", error);
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
    } catch (error) {
      console.error("Failed to duplicate order:", error);
    }
  };

  const handleEditOrder = async (
    orderId: string,
    updates: { spice_level?: number; is_indian_hot?: boolean; special_instructions?: string | null }
  ): Promise<void> => {
    try {
      await updateOrder(orderId, updates);
    } catch (error) {
      console.error("Failed to update order:", error);
      throw error;
    }
  };

  const handleToggleSubmitted = async (
    orderId: string,
    isSubmitted: boolean
  ) => {
    try {
      await updateOrder(orderId, { is_submitted: isSubmitted });
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="loading loading-spinner loading-md mb-2"></div>
        <p className="text-slate-700 text-xs">Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4">
        <div className="text-red-500 mb-2">⚠️</div>
        <p className="text-red-600 text-xs">{error}</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-slate-600 text-sm">No orders yet</p>
      </div>
    );
  }

  // Filter orders based on whether we should show all or just current user's
  const filteredOrders = shouldShowAllOrders
    ? orders
    : orders.filter((order) => order.user_name === currentUserName);

  // Group orders by user name
  const ordersByUser = filteredOrders.reduce((acc, order) => {
    const userName = order.user_name || "Unknown User";
    if (!acc[userName]) {
      acc[userName] = [];
    }
    acc[userName].push(order);
    return acc;
  }, {} as Record<string, OrderWithMenuItem[]>);


  return (
    <div>
      {Object.keys(ordersByUser).length !== 0 && (
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-slate-800">
            {shouldShowAllOrders ? "All Orders" : "Your Order"}
          </h3>
          {isHostView && isOverviewPage && (
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors shadow-sm border ${
                isEditMode
                  ? "bg-orange-100 hover:bg-orange-200 text-orange-700 border-orange-200"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
              }`}
            >
              {isEditMode ? "✓ Done Editing" : "✏️ Edit Status"}
            </button>
          )}
        </div>
      )}

      {Object.entries(ordersByUser).map(([userName, userOrders]) => {
        const isCurrentUser = userName === currentUserName;
        // For hosts, calculate user total excluding unsubmitted orders
        const userOrdersForCalculation = isHostView
          ? userOrders.filter((order) => order.is_submitted)
          : userOrders;

        const userTotal = userOrdersForCalculation.reduce(
          (sum, order) => sum + order.menu_items.price,
          0
        );

        return (
          <div key={userName} className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h4
                className={`font-medium text-sm ${
                  isCurrentUser ? "text-orange-600" : "text-slate-700"
                }`}
              >
                {isCurrentUser ? `${userName} (You)` : userName}
              </h4>
              {isOverviewPage && (
                <span className="text-xs text-slate-500">
                  ${userTotal.toFixed(2)}
                </span>
              )}
            </div>
            <div className="space-y-1">
              {userOrders.map((order) => (
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
                />
              ))}
            </div>
          </div>
        );
      })}

      {/* Show total only on overview page when there are orders */}
      {isOverviewPage && (
        <OrderListTotals
          orders={filteredOrders}
          isHostView={isHostView}
          shouldShowAllOrders={shouldShowAllOrders}
        />
      )}
    </div>
  );
};

export default OrderList;
