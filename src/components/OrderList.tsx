"use client";

import { useState } from "react";
import { useOrders, OrderWithMenuItem } from "@/hooks/useOrders";
import { useActiveEvent } from "@/hooks/useActiveEvent";
import { useAuth } from "@/contexts/AuthContext";
import { useGuestName } from "@/hooks/useGuestName";
import { removeOrderUtil, addOrderSimpleUtil } from "@/util/orderUtil";
import PopupMenu from "./PopupMenu";
import SpiceSelector from "./SpiceSelector";
import { shouldShowSpiceSelector } from "@/util/spiceUtil";

interface OrderListItemProps {
  order: OrderWithMenuItem;
  onRemove: (orderId: string) => void;
  onDuplicate: (order: OrderWithMenuItem) => void;
  onEdit?: (orderId: string, updates: { spice_level?: number; is_indian_hot?: boolean; special_instructions?: string | null }) => Promise<void>;
  onToggleSubmitted?: (orderId: string, isSubmitted: boolean) => void;
  isOverviewPage?: boolean;
  isHostView?: boolean;
  isEditMode?: boolean;
}

const OrderListItem = ({
  order,
  onRemove,
  onDuplicate,
  onEdit,
  onToggleSubmitted,
  isOverviewPage = false,
  isHostView = false,
  isEditMode = false,
}: OrderListItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editSpiceLevel, setEditSpiceLevel] = useState(order.spice_level || 1);
  const [editIndianHot, setEditIndianHot] = useState(order.is_indian_hot || false);
  const [editSpecialInstructions, setEditSpecialInstructions] = useState(order.special_instructions || "");
  const { user } = useAuth();
  const { guestName } = useGuestName();
  const currentUserName =
    user?.user_metadata?.full_name || user?.email || guestName;
  const isCurrentUserOrder = order.user_name === currentUserName;

  const handleRemove = () => {
    onRemove(order.id);
  };

  const handleDuplicate = () => {
    onDuplicate(order);
  };

  const handleEdit = () => {
    setIsEditing(true);
    // Reset edit values to current order values when starting to edit
    setEditSpiceLevel(order.spice_level || 1);
    setEditIndianHot(order.is_indian_hot || false);
    setEditSpecialInstructions(order.special_instructions || "");
  };

  const handleSaveEdit = async () => {
    if (onEdit) {
      try {
        await onEdit(order.id, {
          spice_level: editSpiceLevel,
          is_indian_hot: editIndianHot,
          special_instructions: editSpecialInstructions.trim() || null,
        });
        setIsEditing(false);
      } catch (error) {
        console.error("Failed to save order edit:", error);
      }
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset to original values
    setEditSpiceLevel(order.spice_level || 1);
    setEditIndianHot(order.is_indian_hot || false);
    setEditSpecialInstructions(order.special_instructions || "");
  };

  const handleToggleSubmitted = () => {
    if (onToggleSubmitted) {
      onToggleSubmitted(order.id, !order.is_submitted);
    }
  };

  // Determine if this order should be grayed out (host viewing unsubmitted order)
  const isGrayedOut = isHostView && !order.is_submitted;

  return (
    <div
      className={`bg-white rounded-2xl p-3 mb-2 ${
        isEditing ? "space-y-3" : "flex items-center justify-between"
      } ${isGrayedOut ? "opacity-50" : ""}`}
    >
      {isEditing ? (
        /* Edit Mode */
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-800">
              Editing: {order.menu_items.name}
            </span>
            <div className="flex space-x-2">
              <button
                onClick={handleSaveEdit}
                className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-xs rounded-lg transition-colors"
              >
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="px-3 py-1 bg-slate-300 hover:bg-slate-400 text-slate-700 text-xs rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>

          {/* Spice Level Editor - Show only if item supports spice levels */}
          {shouldShowSpiceSelector({
            id: order.menu_items.id,
            name: order.menu_items.name,
            description: order.menu_items.description || '',
            price: order.menu_items.price,
            spiceLevel: 0,
            vegetarian: order.menu_items.is_vegetarian || false,
            vegan: order.menu_items.is_vegan || false
          }) && (
            <div>
              <SpiceSelector
                spiceLevel={editSpiceLevel}
                onSpiceLevelChange={setEditSpiceLevel}
                indianHot={editIndianHot}
                onIndianHotChange={setEditIndianHot}
                shouldShow={true}
              />
            </div>
          )}

          {/* Special Instructions Editor */}
          <div>
            <textarea
              value={editSpecialInstructions}
              onChange={(e) => setEditSpecialInstructions(e.target.value)}
              placeholder="Special instructions (optional)"
              className="w-full p-2 border border-slate-300 rounded-lg bg-white text-slate-800 placeholder-slate-500 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-400"
              rows={2}
              maxLength={200}
            />
            {editSpecialInstructions.length > 150 && (
              <div className="text-xs text-slate-600 mt-1">
                {200 - editSpecialInstructions.length} characters remaining
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Normal View */
        <>
          <div className="flex-1">
        <span
          className={`text-sm font-medium ${
            isGrayedOut ? "text-slate-400" : "text-slate-800"
          }`}
        >
          {order.menu_items.name}
          {isGrayedOut && (
            <span className="ml-2 text-xs text-slate-400">(Not Submitted)</span>
          )}
        </span>
        {(order.spice_level ?? 0) > 0 && shouldShowSpiceSelector({ 
          id: order.menu_items.id, 
          name: order.menu_items.name, 
          description: order.menu_items.description || '',
          price: order.menu_items.price,
          spiceLevel: 0,
          vegetarian: order.menu_items.is_vegetarian || false,
          vegan: order.menu_items.is_vegan || false
        }) && (
          <div
            className={`text-xs mt-1 ${
              isGrayedOut ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Spice Level: {order.spice_level}
            {order.is_indian_hot ? " (Indian Hot)" : ""}
          </div>
        )}
        {isOverviewPage && (
          <div
            className={`text-xs mt-1 ${
              isGrayedOut ? "text-slate-400" : "text-slate-600"
            }`}
          >
            ${order.menu_items.price.toFixed(2)}
          </div>
        )}
        {order.special_instructions && (
          <div
            className={`text-xs mt-1 ${
              isGrayedOut ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Note: {order.special_instructions}
          </div>
        )}
      </div>
      <div className="flex items-center space-x-2">
        {order.is_submitted && (
          <span className="text-xs text-green-600">✓ Ordered</span>
        )}
        <div
          className={`text-xs ${
            isGrayedOut ? "text-slate-400" : "text-slate-500"
          }`}
        >
          ${order.menu_items.price.toFixed(2)}
        </div>
        {isEditMode && isHostView && (
          <button
            onClick={handleToggleSubmitted}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors shadow-sm ${
              order.is_submitted
                ? "bg-green-100 hover:bg-green-200 text-green-700 border border-green-200"
                : "bg-orange-100 hover:bg-orange-200 text-orange-700 border border-orange-200"
            }`}
            title={
              order.is_submitted ? "Mark as not submitted" : "Mark as submitted"
            }
          >
            {order.is_submitted ? "✓ Submitted" : "✗ Pending"}
          </button>
        )}
        {!isOverviewPage && (
          <PopupMenu
            items={[
              {
                label: "Duplicate Order",
                onClick: handleDuplicate,
                icon: <span className="text-blue-600">⧉</span>,
              },
              ...(isCurrentUserOrder && onEdit ? [{
                label: "Edit Order",
                onClick: handleEdit,
                icon: <span className="text-orange-600">✎</span>,
              }] : []),
              ...(isCurrentUserOrder ? [{
                label: "Remove Order",
                onClick: handleRemove,
                icon: <span className="text-red-600">−</span>,
                className: "text-red-600 hover:text-red-700 hover:bg-red-50",
              }] : []),
            ]}
            trigger={
              <button className="w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-600 hover:text-slate-800 transition-colors">
                <span className="text-sm">⋯</span>
              </button>
            }
            position="bottom-right"
          />
        )}
          </div>
        </>
      )}
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
  onOrderAdded?: (newOrder: OrderWithMenuItem) => void;
  onOrderRemoved?: (orderId: string) => void;
  onOrderUpdated?: (updatedOrder: OrderWithMenuItem) => void;
}

export const OrderList = ({
  showAllOrders = false,
  isOverviewPage = false,
  isHostView = false,
  orders: propOrders,
  loading: propLoading,
  error: propError,
  onOrderAdded,
  onOrderRemoved,
  onOrderUpdated,
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
  const updateOrder = hookResult.updateOrder;

  // Get current user name for filtering
  const currentUserName =
    user?.user_metadata?.full_name || user?.email || guestName;

  // Only show all orders if explicitly requested via prop
  const shouldShowAllOrders = showAllOrders;

  const handleRemoveOrder = async (orderId: string) => {
    try {
      if (propOrders && onOrderRemoved) {
        // Optimistic update: immediately update parent's state
        onOrderRemoved(orderId);
        // Only remove from database if it's not a temporary ID
        if (!orderId.startsWith('temp-')) {
          await removeOrderUtil(orderId);
        }
      } else {
        // When using internal state, let the hook handle both database and UI update
        await hookResult.removeOrder(orderId);
      }
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
      // Create duplicate order data without ID and timestamps
      const duplicateData = {
        menu_item_id: order.menu_item_id,
        event_id: order.event_id,
        spice_level: order.spice_level,
        is_indian_hot: order.is_indian_hot,
        special_instructions: order.special_instructions,
      };

      const userName = user?.user_metadata?.full_name || user?.email || guestName;

      if (propOrders && onOrderAdded) {
        // Create optimistic order object for immediate UI update
        const optimisticOrder: OrderWithMenuItem = {
          id: `temp-${Date.now()}`, // Temporary ID
          ...duplicateData,
          user_name: userName || 'Guest',
          created_at: new Date().toISOString(),
          is_submitted: false,
          menu_items: order.menu_items, // Copy menu item data
        };
        
        // Optimistic update: immediately update parent's state
        onOrderAdded(optimisticOrder);
        // Then add to database in background
        await addOrderSimpleUtil(duplicateData, userName);
      } else {
        // When using internal state, let the hook handle both database and UI update
        await hookResult.addOrder(duplicateData, guestName);
      }
    } catch (error) {
      console.error("Failed to duplicate order:", error);
    }
  };

  const handleEditOrder = async (
    orderId: string,
    updates: { spice_level?: number; is_indian_hot?: boolean; special_instructions?: string | null }
  ) => {
    try {
      const updatedOrder = await updateOrder(orderId, updates);
      
      // If using prop orders and callback is provided, call it for optimistic update
      if (propOrders && onOrderUpdated) {
        onOrderUpdated(updatedOrder);
      }
      
      return updatedOrder;
    } catch (error) {
      console.error("Failed to update order:", error);
      throw error; // Re-throw so the OrderListItem can handle the error
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

  // Calculate totals for overview page
  // For hosts, exclude unsubmitted orders from calculation
  const ordersForCalculation = isHostView
    ? filteredOrders.filter((order) => order.is_submitted)
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
      {isOverviewPage && filteredOrders.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-300 space-y-2">
          {/* Subtotal */}
          <div className="flex justify-between items-center">
            <span className="text-slate-700">
              {shouldShowAllOrders ? "Group Subtotal:" : "Subtotal:"}
            </span>
            <span className="text-slate-700">${total.toFixed(2)}</span>
          </div>

          {/* Tax (7%) */}
          <div className="flex justify-between items-center">
            <span className="text-slate-700">Tax (7%):</span>
            <span className="text-slate-700">${(total * 0.07).toFixed(2)}</span>
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
