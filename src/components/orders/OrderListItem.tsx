"use client";

import { useState } from "react";
import { OrderWithMenuItem } from "@/hooks/useOrders";
import { useAuth } from "@/contexts/AuthContext";
import { useGuestName } from "@/hooks/useGuestName";
import PopupMenu from "../PopupMenu";
import SpiceSelector from "../SpiceSelector";
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

export default function OrderListItem({
  order,
  onRemove,
  onDuplicate,
  onEdit,
  onToggleSubmitted,
  isOverviewPage = false,
  isHostView = false,
  isEditMode = false,
}: OrderListItemProps) {
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
                label: "Duplicate",
                onClick: handleDuplicate,
                icon: <span className="text-blue-600">⧉</span>,
              },
              ...(isCurrentUserOrder && onEdit ? [{
                label: "Edit",
                onClick: handleEdit,
                icon: <span className="text-orange-600">✎</span>,
              }] : []),
              ...(isCurrentUserOrder ? [{
                label: "Remove",
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
}
