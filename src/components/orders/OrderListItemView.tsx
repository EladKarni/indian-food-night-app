"use client";

import { ReactNode } from "react";
import { OrderWithMenuItem } from "@/hooks/useOrders";
import SpiceDots from "@/ui/SpiceDots";

interface OrderListItemViewProps {
  order: OrderWithMenuItem;
  supportsSpice: boolean;
  isGrayedOut: boolean;
  isOverviewPage: boolean;
  isEditMode: boolean;
  isHostView: boolean;
  hideDivider: boolean;
  onToggleSubmitted: () => void;
  menuTrigger: ReactNode;
}

export default function OrderListItemView({
  order,
  supportsSpice,
  isGrayedOut,
  isOverviewPage,
  isEditMode,
  isHostView,
  hideDivider,
  onToggleSubmitted,
  menuTrigger,
}: OrderListItemViewProps) {
  const showSpice = supportsSpice && (order.spice_level ?? 0) > 0;
  const rowClass = [
    "ifn-order-row",
    hideDivider ? "ifn-order-row--no-divider" : "",
    isGrayedOut ? "ifn-order-row--dim" : "",
  ]
    .filter(Boolean)
    .join(" ");

  function renderNotSubmittedTag() {
    if (!isGrayedOut) return null;
    return (
      <span
        style={{
          marginLeft: 8,
          fontSize: 11,
          color: "var(--ifn-muted)",
        }}
      >
        (Not submitted)
      </span>
    );
  }

  function renderSpiceLine() {
    if (!showSpice) return null;
    return (
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
    );
  }

  function renderSpecialInstructions() {
    if (!order.special_instructions) return null;
    return <div className="ifn-meta">Note: {order.special_instructions}</div>;
  }

  function renderOrderedPill() {
    if (!order.is_submitted || isOverviewPage) return null;
    return (
      <span className="ifn-pill ifn-pill--green" style={{ fontSize: 10 }}>
        Ordered
      </span>
    );
  }

  function renderSubmitToggle() {
    if (!isEditMode || !isHostView) return null;
    return (
      <button
        type="button"
        onClick={onToggleSubmitted}
        className={
          order.is_submitted
            ? "ifn-pill ifn-pill--green"
            : "ifn-pill ifn-pill--accent"
        }
        style={{ fontSize: 10 }}
        title={
          order.is_submitted ? "Mark as not submitted" : "Mark as submitted"
        }
      >
        {order.is_submitted ? "Submitted" : "Pending"}
      </button>
    );
  }

  return (
    <div className={rowClass}>
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
          {renderNotSubmittedTag()}
        </div>
        {renderSpiceLine()}
        {renderSpecialInstructions()}
      </div>

      {renderOrderedPill()}

      <div
        className="ifn-num"
        style={{ fontSize: 13.5, color: "var(--ifn-ink-2)" }}
      >
        ${order.menu_items.price.toFixed(2)}
      </div>

      {renderSubmitToggle()}

      {!isOverviewPage && menuTrigger}
    </div>
  );
}
