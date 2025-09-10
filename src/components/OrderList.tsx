"use client";

import { useOrders, OrderWithMenuItem } from "@/hooks/useOrders";
import { useActiveEvent } from "@/hooks/useActiveEvent";
import { useAuth } from "@/contexts/AuthContext";
import { useGuestName } from "@/hooks/useGuestName";
import { removeOrderUtil, duplicateOrderUtil } from "@/util/orderUtil";

interface OrderListItemProps {
  order: OrderWithMenuItem;
  onRemove: (orderId: string) => void;
  onDuplicate: (order: OrderWithMenuItem) => void;
  isOverviewPage?: boolean;
}

const OrderListItem = ({
  order,
  onRemove,
  onDuplicate,
  isOverviewPage = false,
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

  return (
    <div className="bg-white rounded-2xl p-3 mb-2 flex items-center justify-between">
      <div className="flex-1">
        <span className="text-slate-800 text-sm font-medium">
          {order.menu_items.name}
        </span>
        <div className="text-xs text-slate-500 mt-1">
          Spice Level: {order.spice_level}
          {order.is_indian_hot ? " (Indian Hot)" : ""}
          {isOverviewPage && (
            <div className="text-xs text-slate-600 mt-1">
              ${order.menu_items.price.toFixed(2)}
            </div>
          )}
        </div>
        {order.special_instructions && (
          <div className="text-xs text-slate-500 mt-1">
            Note: {order.special_instructions}
          </div>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <div className="text-xs text-slate-500">
          ${order.menu_items.price.toFixed(2)}
        </div>
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
      </div>
    </div>
  );
};

interface OrderListProps {
  showAllOrders?: boolean;
  isOverviewPage?: boolean;
  orders?: OrderWithMenuItem[];
  loading?: boolean;
  error?: string | null;
}

export const OrderList = ({ 
  showAllOrders = false, 
  isOverviewPage = false,
  orders: propOrders,
  loading: propLoading,
  error: propError
}: OrderListProps) => {
  const { activeEvent } = useActiveEvent();
  const hookResult = useOrders(activeEvent?.id);
  const { user } = useAuth();
  const { guestName } = useGuestName();

  // Use props if provided, otherwise use hook
  const orders = propOrders ?? hookResult.orders;
  const loading = propLoading ?? hookResult.loading;
  const error = propError ?? hookResult.error;
  const refetch = hookResult.refetch;

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
  const total = filteredOrders.reduce(
    (sum, order) => sum + order.menu_items.price,
    0
  );

  return (
    <div>
      {Object.keys(ordersByUser).length !== 0 && (
        <h3 className="text-lg font-semibold text-slate-800 mb-3">
          {shouldShowAllOrders ? "All Orders" : "Your Order"}
        </h3>
      )}

      {Object.entries(ordersByUser).map(([userName, userOrders]) => {
        const isCurrentUser = userName === currentUserName;
        const userTotal = userOrders.reduce(
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
                  isOverviewPage={isOverviewPage}
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
