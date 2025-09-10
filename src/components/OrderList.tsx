"use client";

import { useState } from "react";
import { useOrders, OrderWithMenuItem } from "@/hooks/useOrders";
import { useActiveEvent } from "@/hooks/useActiveEvent";
import { useAuth } from "@/contexts/AuthContext";
import { useGuestName } from "@/hooks/useGuestName";
import { removeOrderUtil, duplicateOrderUtil } from "@/util/orderUtil";

interface OrderListItemProps {
  order: OrderWithMenuItem;
  onRemove: (orderId: string) => void;
  onDuplicate: (order: OrderWithMenuItem) => void;
  onToggleSubmitted?: (orderId: string, isSubmitted: boolean) => void;
  isOverviewPage?: boolean;
  isHostView?: boolean;
  isEditMode?: boolean;
}

const OrderListItem = ({
  order,
  onRemove,
  onDuplicate,
  onToggleSubmitted,
  isOverviewPage = false,
  isHostView = false,
  isEditMode = false,
}: OrderListItemProps) => {
  const { user } = useAuth();
  const { guestName } = useGuestName();
  const currentUserName = user?.user_metadata?.full_name || user?.email || guestName;
  const isCurrentUserOrder = order.user_name === currentUserName;

  const handleRemove = () => {
    onRemove(order.id);
  };

  const handleDuplicate = () => {
    onDuplicate(order);
  };

  const handleToggleSubmitted = () => {
    if (onToggleSubmitted) {
      onToggleSubmitted(order.id, !order.is_submitted);
    }
  };

  // Determine if this order should be grayed out (host viewing unsubmitted order)
  const isGrayedOut = isHostView && !order.is_submitted;

  return (
    <div className={`bg-white rounded-2xl p-3 mb-2 flex items-center justify-between ${isGrayedOut ? 'opacity-50' : ''}`}>
      <div className="flex-1">
        <span className={`text-sm font-medium ${isGrayedOut ? 'text-slate-400' : 'text-slate-800'}`}>
          {order.menu_items.name}
          {isGrayedOut && <span className="ml-2 text-xs text-slate-400">(Not Submitted)</span>}
        </span>
        <div className={`text-xs mt-1 ${isGrayedOut ? 'text-slate-400' : 'text-slate-500'}`}>
          Spice Level: {order.spice_level}
          {order.is_indian_hot ? " (Indian Hot)" : ""}
          {isOverviewPage && (
            <div className={`text-xs mt-1 ${isGrayedOut ? 'text-slate-400' : 'text-slate-600'}`}>
              ${order.menu_items.price.toFixed(2)}
            </div>
          )}
        </div>
        {order.special_instructions && (
          <div className={`text-xs mt-1 ${isGrayedOut ? 'text-slate-400' : 'text-slate-500'}`}>
            Note: {order.special_instructions}
          </div>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <div className={`text-xs ${isGrayedOut ? 'text-slate-400' : 'text-slate-500'}`}>
          ${order.menu_items.price.toFixed(2)}
        </div>
        {isEditMode && isHostView && (
          <button
            onClick={handleToggleSubmitted}
            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
              order.is_submitted
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-gray-300 hover:bg-gray-400 text-gray-700'
            }`}
            title={order.is_submitted ? 'Mark as not submitted' : 'Mark as submitted'}
          >
            {order.is_submitted ? '✓ Submitted' : '✗ Not Submitted'}
          </button>
        )}
        {!isOverviewPage && (
          <>
            <button
              onClick={handleDuplicate}
              className="w-6 h-6 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold transition-colors"
              title="Duplicate this order"
            >
              ⧉
            </button>
            {isCurrentUserOrder && (
              <button
                onClick={handleRemove}
                className="w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold transition-colors"
                title="Remove this order"
              >
                −
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

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
  error: propError
}: OrderListProps) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const { activeEvent } = useActiveEvent();
  const hookResult = useOrders(activeEvent?.id);
  const { user } = useAuth();
  const { guestName } = useGuestName();

  // Use props if provided, otherwise use hook
  const orders = propOrders ?? hookResult.orders;
  const loading = propLoading ?? hookResult.loading;
  const error = propError ?? hookResult.error;
  const refetch = hookResult.refetch;
  const updateOrder = hookResult.updateOrder;

  // Get current user name for filtering
  const currentUserName =
    user?.user_metadata?.full_name || user?.email || guestName;

  // Only show all orders if explicitly requested via prop
  const shouldShowAllOrders = showAllOrders;

  const handleRemoveOrder = async (orderId: string) => {
    try {
      await removeOrderUtil(orderId);
      await refetch();
    } catch (error) {
      console.error("Failed to remove order:", error);
    }
  };

  const handleDuplicateOrder = async (order: OrderWithMenuItem) => {
    if (!activeEvent) {
      console.error("Missing active event");
      return;
    }

    // If no user is logged in, use guest name
    const orderUser = user || {
      id: "guest",
      email: guestName || "Guest",
      user_metadata: { full_name: guestName || "Guest" },
    };

    try {
      await duplicateOrderUtil(order, {
        user: orderUser,
        eventId: activeEvent.id,
      });
      await refetch();
    } catch (error) {
      console.error("Failed to duplicate order:", error);
    }
  };

  const handleToggleSubmitted = async (orderId: string, isSubmitted: boolean) => {
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

  // Calculate totals for overview page
  // For hosts, exclude unsubmitted orders from calculation
  const ordersForCalculation = isHostView 
    ? filteredOrders.filter(order => order.is_submitted)
    : filteredOrders;
  
  const total = ordersForCalculation.reduce(
    (sum, order) => sum + order.menu_items.price,
    0
  );

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
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                isEditMode
                  ? 'bg-orange-500 hover:bg-orange-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              {isEditMode ? '✓ Done Editing' : '✏️ Edit Status'}
            </button>
          )}
        </div>
      )}

      {Object.entries(ordersByUser).map(([userName, userOrders]) => {
        const isCurrentUser = userName === currentUserName;
        // For hosts, calculate user total excluding unsubmitted orders
        const userOrdersForCalculation = isHostView 
          ? userOrders.filter(order => order.is_submitted)
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
      {isOverviewPage && filteredOrders.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-300 space-y-2">
          {/* Subtotal */}
          <div className="flex justify-between items-center">
            <span className="text-slate-700">
              {shouldShowAllOrders ? "Group Subtotal:" : "Subtotal:"}
            </span>
            <span className="text-slate-700">
              ${total.toFixed(2)}
            </span>
          </div>
          
          {/* Tax (7%) */}
          <div className="flex justify-between items-center">
            <span className="text-slate-700">Tax (7%):</span>
            <span className="text-slate-700">
              ${(total * 0.07).toFixed(2)}
            </span>
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
      )}
    </div>
  );
};

export default OrderList;
