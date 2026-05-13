"use client";

import type { OrderGroup } from "@/util/orderGrouping";
import OrderListItemTitle from "./OrderListItemTitle";
import OrderListItemSpiceLine from "./OrderListItemSpiceLine";
import OrderListItemPrice from "./OrderListItemPrice";
import OrderListItemSubmitToggle from "./OrderListItemSubmitToggle";
import OrderListItemActions from "./OrderListItemActions";

interface OrderListItemViewProps {
  group: OrderGroup;
  supportsSpice: boolean;
  isGrayedOut: boolean;
  isOverviewPage: boolean;
  isEditMode: boolean;
  isHostView: boolean;
  canEdit: boolean;
  canRemove: boolean;
  onIncrement: () => void;
  onDecrement: () => void;
  onEdit: () => void;
  onRemoveGroup: () => void;
  onToggleSubmitted: () => void;
}

export default function OrderListItemView({
  group,
  supportsSpice,
  isGrayedOut,
  isOverviewPage,
  isEditMode,
  isHostView,
  canEdit,
  canRemove,
  onIncrement,
  onDecrement,
  onEdit,
  onRemoveGroup,
  onToggleSubmitted,
}: OrderListItemViewProps) {
  const { representative } = group;
  const quantity = group.orders.length;
  const showSpice = supportsSpice && (representative.spice_level ?? 0) > 0;
  const allSubmitted = group.orders.every((o) => o.is_submitted);
  const showActions = canEdit || canRemove;
  const showOrderedPill = !isOverviewPage && allSubmitted;
  const showSubmitToggle = isEditMode && isHostView;

  const cardClass = ["ifn-card--row", isGrayedOut ? "ifn-card--row--dim" : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cardClass}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 12,
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <OrderListItemTitle
            name={representative.menu_items.name}
            showNotSubmittedTag={isGrayedOut}
          />
          {showSpice && (
            <OrderListItemSpiceLine
              spiceLevel={representative.spice_level || 0}
              isIndianHot={!!representative.is_indian_hot}
            />
          )}
          {representative.special_instructions && (
            <div className="ifn-meta">
              Note: {representative.special_instructions}
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexShrink: 0,
          }}
        >
          {showOrderedPill && (
            <span
              className="ifn-pill ifn-pill--green"
              style={{ fontSize: 10 }}
            >
              Ordered
            </span>
          )}
          {showSubmitToggle && (
            <OrderListItemSubmitToggle
              isSubmitted={!!representative.is_submitted}
              onToggle={onToggleSubmitted}
            />
          )}
          <OrderListItemPrice
            unitPrice={representative.menu_items.price}
            quantity={quantity}
          />
        </div>
      </div>

      {showActions && (
        <OrderListItemActions
          quantity={quantity}
          canEdit={canEdit}
          canRemove={canRemove}
          onIncrement={onIncrement}
          onDecrement={onDecrement}
          onEdit={onEdit}
          onRemoveGroup={onRemoveGroup}
        />
      )}
    </div>
  );
}
