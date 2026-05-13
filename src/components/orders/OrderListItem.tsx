"use client";

import { OrderWithMenuItem } from "@/hooks/useOrders";
import { useAuth } from "@/contexts/AuthContext";
import { useGuestName } from "@/hooks/useGuestName";
import { useOrderEditDraft } from "@/hooks/useOrderEditDraft";
import { shouldShowSpiceSelector } from "@/util/spiceUtil";
import type { OrderGroup } from "@/util/orderGrouping";
import OrderListItemView from "./OrderListItemView";
import OrderListItemEditor from "./OrderListItemEditor";

interface OrderListItemProps {
  group: OrderGroup;
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
}

export default function OrderListItem({
  group,
  onRemove,
  onDuplicate,
  onEdit,
  onToggleSubmitted,
  isOverviewPage = false,
  isHostView = false,
  isEditMode = false,
}: OrderListItemProps) {
  const { user } = useAuth();
  const { guestName } = useGuestName();
  const { representative } = group;
  const draft = useOrderEditDraft({ order: representative, onEdit });

  const currentUserName =
    user?.user_metadata?.full_name || user?.email || guestName;
  const isCurrentUserOrder = representative.user_name === currentUserName;

  const supportsSpice = shouldShowSpiceSelector({
    id: representative.menu_items.id,
    name: representative.menu_items.name,
    description: representative.menu_items.description || "",
    price: representative.menu_items.price,
    spiceLevel: 0,
    vegetarian: representative.menu_items.is_vegetarian || false,
    vegan: representative.menu_items.is_vegan || false,
  });

  if (draft.isEditing) {
    return (
      <OrderListItemEditor
        itemName={representative.menu_items.name}
        supportsSpice={supportsSpice}
        spiceLevel={draft.spiceLevel}
        onSpiceLevelChange={draft.setSpiceLevel}
        indianHot={draft.indianHot}
        onIndianHotChange={draft.setIndianHot}
        specialInstructions={draft.specialInstructions}
        onSpecialInstructionsChange={draft.setSpecialInstructions}
        onSave={draft.saveEdits}
        onCancel={draft.cancelEditing}
        hideDivider
      />
    );
  }

  const canEdit = isCurrentUserOrder && !!onEdit && !isOverviewPage;
  const canRemove = isCurrentUserOrder && !isOverviewPage;

  return (
    <OrderListItemView
      group={group}
      supportsSpice={supportsSpice}
      isGrayedOut={isHostView && !representative.is_submitted}
      isOverviewPage={isOverviewPage}
      isEditMode={isEditMode}
      isHostView={isHostView}
      canEdit={canEdit}
      canRemove={canRemove}
      onIncrement={() => onDuplicate(representative)}
      onDecrement={() => onRemove(representative.id)}
      onEdit={draft.beginEditing}
      onRemoveGroup={() => {
        group.orders.forEach((o) => onRemove(o.id));
      }}
      onToggleSubmitted={() =>
        onToggleSubmitted?.(representative.id, !representative.is_submitted)
      }
    />
  );
}
