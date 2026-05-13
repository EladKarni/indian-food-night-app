"use client";

import { useState } from "react";
import { OrderWithMenuItem } from "@/hooks/useOrders";
import { useAuth } from "@/contexts/AuthContext";
import { useGuestName } from "@/hooks/useGuestName";
import PopupMenu from "../PopupMenu";
import SpiceSelector from "../SpiceSelector";
import SpiceDots from "@/ui/SpiceDots";
import { shouldShowSpiceSelector } from "@/util/spiceUtil";

interface OrderListItemProps {
  order: OrderWithMenuItem;
  onRemove: (orderId: string) => void;
  onDuplicate: (order: OrderWithMenuItem) => void;
  onEdit?: (
    orderId: string,
    updates: {
      spice_level?: number;
      is_indian_hot?: boolean;
      special_instructions?: string | null;
    }
  ) => Promise<void>;
  onToggleSubmitted?: (orderId: string, isSubmitted: boolean) => void;
  isOverviewPage?: boolean;
  isHostView?: boolean;
  isEditMode?: boolean;
  hideDivider?: boolean;
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
  hideDivider = false,
}: OrderListItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editSpiceLevel, setEditSpiceLevel] = useState(order.spice_level || 1);
  const [editIndianHot, setEditIndianHot] = useState(
    order.is_indian_hot || false
  );
  const [editSpecialInstructions, setEditSpecialInstructions] = useState(
    order.special_instructions || ""
  );
  const { user } = useAuth();
  const { guestName } = useGuestName();
  const currentUserName =
    user?.user_metadata?.full_name || user?.email || guestName;
  const isCurrentUserOrder = order.user_name === currentUserName;

  const supportsSpice = shouldShowSpiceSelector({
    id: order.menu_items.id,
    name: order.menu_items.name,
    description: order.menu_items.description || "",
    price: order.menu_items.price,
    spiceLevel: 0,
    vegetarian: order.menu_items.is_vegetarian || false,
    vegan: order.menu_items.is_vegan || false,
  });

  const handleRemove = () => onRemove(order.id);
  const handleDuplicate = () => onDuplicate(order);
  const handleEdit = () => {
    setIsEditing(true);
    setEditSpiceLevel(order.spice_level || 1);
    setEditIndianHot(order.is_indian_hot || false);
    setEditSpecialInstructions(order.special_instructions || "");
  };
  const handleSaveEdit = async () => {
    if (!onEdit) return;
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
  };
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditSpiceLevel(order.spice_level || 1);
    setEditIndianHot(order.is_indian_hot || false);
    setEditSpecialInstructions(order.special_instructions || "");
  };
  const handleToggleSubmitted = () => {
    if (onToggleSubmitted) {
      onToggleSubmitted(order.id, !order.is_submitted);
    }
  };

  const isGrayedOut = isHostView && !order.is_submitted;
  const rowStyle: React.CSSProperties = {
    padding: "14px 16px",
    display: "flex",
    alignItems: "center",
    gap: 12,
    borderBottom: hideDivider ? "none" : "1px solid var(--ifn-border)",
    opacity: isGrayedOut ? 0.55 : 1,
  };

  if (isEditing) {
    return (
      <div style={{ padding: 16, borderBottom: hideDivider ? "none" : "1px solid var(--ifn-border)" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 10,
          }}
        >
          <span style={{ fontSize: 14, fontWeight: 500 }}>
            Editing: {order.menu_items.name}
          </span>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="button"
              onClick={handleSaveEdit}
              className="ifn-btn ifn-btn--primary"
              style={{ padding: "8px 14px", fontSize: 13 }}
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleCancelEdit}
              className="ifn-btn ifn-btn--ghost"
              style={{ padding: "8px 14px", fontSize: 13 }}
            >
              Cancel
            </button>
          </div>
        </div>

        {supportsSpice && (
          <SpiceSelector
            spiceLevel={editSpiceLevel}
            onSpiceLevelChange={setEditSpiceLevel}
            indianHot={editIndianHot}
            onIndianHotChange={setEditIndianHot}
            shouldShow={true}
          />
        )}

        <textarea
          className="ifn-input"
          value={editSpecialInstructions}
          onChange={(e) => setEditSpecialInstructions(e.target.value)}
          placeholder="Special instructions (optional)"
          rows={2}
          maxLength={200}
          style={{ resize: "none", fontFamily: "var(--ifn-ui)" }}
        />
        {editSpecialInstructions.length > 150 && (
          <div
            style={{ fontSize: 11, color: "var(--ifn-muted)", marginTop: 4 }}
          >
            {200 - editSpecialInstructions.length} characters remaining
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={rowStyle}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 14.5,
            fontWeight: 500,
            marginBottom: 3,
            color: "var(--ifn-ink)",
          }}
        >
          {order.menu_items.name}
          {isGrayedOut && (
            <span
              style={{
                marginLeft: 8,
                fontSize: 11,
                color: "var(--ifn-muted)",
              }}
            >
              (Not submitted)
            </span>
          )}
        </div>
        {supportsSpice && (order.spice_level ?? 0) > 0 && (
          <div
            style={{
              fontSize: 12,
              color: "var(--ifn-muted)",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <SpiceDots level={order.spice_level || 0} />
            <span>
              Spice {order.spice_level}
              {order.is_indian_hot && (
                <span style={{ color: "var(--ifn-chili)" }}> · Indian hot</span>
              )}
            </span>
          </div>
        )}
        {order.special_instructions && (
          <div
            style={{
              fontSize: 11.5,
              color: "var(--ifn-muted)",
              marginTop: 4,
            }}
          >
            Note: {order.special_instructions}
          </div>
        )}
      </div>

      {order.is_submitted && !isOverviewPage && (
        <span
          className="ifn-pill ifn-pill--green"
          style={{ fontSize: 10 }}
        >
          Ordered
        </span>
      )}

      <div
        className="ifn-num"
        style={{ fontSize: 13.5, color: "var(--ifn-ink-2)" }}
      >
        ${order.menu_items.price.toFixed(2)}
      </div>

      {isEditMode && isHostView && (
        <button
          type="button"
          onClick={handleToggleSubmitted}
          className={
            order.is_submitted
              ? "ifn-pill ifn-pill--green"
              : "ifn-pill ifn-pill--accent"
          }
          style={{ border: 0, cursor: "pointer", fontSize: 10 }}
          title={
            order.is_submitted
              ? "Mark as not submitted"
              : "Mark as submitted"
          }
        >
          {order.is_submitted ? "Submitted" : "Pending"}
        </button>
      )}

      {!isOverviewPage && (
        <PopupMenu
          items={[
            {
              label: "Duplicate",
              onClick: handleDuplicate,
              icon: <span style={{ color: "var(--ifn-primary)" }}>⧉</span>,
            },
            ...(isCurrentUserOrder && onEdit
              ? [
                  {
                    label: "Edit",
                    onClick: handleEdit,
                    icon: <span style={{ color: "var(--ifn-primary)" }}>✎</span>,
                  },
                ]
              : []),
            ...(isCurrentUserOrder
              ? [
                  {
                    label: "Remove",
                    onClick: handleRemove,
                    icon: <span style={{ color: "var(--ifn-chili)" }}>−</span>,
                  },
                ]
              : []),
          ]}
          trigger={
            <button
              type="button"
              style={{
                width: 30,
                height: 30,
                borderRadius: 10,
                border: 0,
                background: "var(--ifn-surface-2)",
                color: "var(--ifn-muted)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              ⋯
            </button>
          }
          position="bottom-right"
        />
      )}
    </div>
  );
}
