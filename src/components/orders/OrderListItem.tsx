"use client";

import { OrderWithMenuItem } from "@/hooks/useOrders";
import { useAuth } from "@/contexts/AuthContext";
import { useGuestName } from "@/hooks/useGuestName";
import { useOrderEditDraft } from "@/hooks/useOrderEditDraft";
import { shouldShowSpiceSelector } from "@/util/spiceUtil";
import PopupMenu from "../PopupMenu";
import OrderListItemView from "./OrderListItemView";
import OrderListItemEditor from "./OrderListItemEditor";

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

function buildMenuItems({
  canEdit,
  canRemove,
  onDuplicate,
  onEdit,
  onRemove,
}: {
  canEdit: boolean;
  canRemove: boolean;
  onDuplicate: () => void;
  onEdit: () => void;
  onRemove: () => void;
}) {
  const items = [
    {
      label: "Duplicate",
      onClick: onDuplicate,
      icon: <span style={{ color: "var(--ifn-primary)" }}>⧉</span>,
    },
  ];
  if (canEdit) {
    items.push({
      label: "Edit",
      onClick: onEdit,
      icon: <span style={{ color: "var(--ifn-primary)" }}>✎</span>,
    });
  }
  if (canRemove) {
    items.push({
      label: "Remove",
      onClick: onRemove,
      icon: <span style={{ color: "var(--ifn-chili)" }}>−</span>,
    });
  }
  return items;
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
  const { user } = useAuth();
  const { guestName } = useGuestName();
  const draft = useOrderEditDraft({ order, onEdit });

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

  if (draft.isEditing) {
    return (
      <OrderListItemEditor
        itemName={order.menu_items.name}
        supportsSpice={supportsSpice}
        spiceLevel={draft.spiceLevel}
        onSpiceLevelChange={draft.setSpiceLevel}
        indianHot={draft.indianHot}
        onIndianHotChange={draft.setIndianHot}
        specialInstructions={draft.specialInstructions}
        onSpecialInstructionsChange={draft.setSpecialInstructions}
        onSave={draft.saveEdits}
        onCancel={draft.cancelEditing}
        hideDivider={hideDivider}
      />
    );
  }

  const menuItems = buildMenuItems({
    canEdit: isCurrentUserOrder && !!onEdit,
    canRemove: isCurrentUserOrder,
    onDuplicate: () => onDuplicate(order),
    onEdit: draft.beginEditing,
    onRemove: () => onRemove(order.id),
  });

  const menuTrigger = (
    <PopupMenu
      items={menuItems}
      trigger={
        <button type="button" className="ifn-icon-btn">
          ⋯
        </button>
      }
      position="bottom-right"
    />
  );

  return (
    <OrderListItemView
      order={order}
      supportsSpice={supportsSpice}
      isGrayedOut={isHostView && !order.is_submitted}
      isOverviewPage={isOverviewPage}
      isEditMode={isEditMode}
      isHostView={isHostView}
      hideDivider={hideDivider}
      onToggleSubmitted={() =>
        onToggleSubmitted?.(order.id, !order.is_submitted)
      }
      menuTrigger={menuTrigger}
    />
  );
}
