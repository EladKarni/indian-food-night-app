"use client";

import QuantityStepper from "@/ui/QuantityStepper";
import { PencilIcon, TrashIcon } from "@/ui/icons";

interface OrderListItemActionsProps {
  quantity: number;
  canEdit: boolean;
  canRemove: boolean;
  onIncrement: () => void;
  onDecrement: () => void;
  onEdit: () => void;
  onRemoveGroup: () => void;
}

export default function OrderListItemActions({
  quantity,
  canEdit,
  canRemove,
  onIncrement,
  onDecrement,
  onEdit,
  onRemoveGroup,
}: OrderListItemActionsProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginTop: 4,
        justifyContent: "flex-end",
        flexWrap: "wrap",
      }}
    >
      {canRemove && (
        <QuantityStepper
          quantity={quantity}
          onIncrement={onIncrement}
          onDecrement={onDecrement}
          minusDisabled={quantity === 1}
        />
      )}
      {canEdit && (
        <button
          type="button"
          className="ifn-icon-btn"
          onClick={onEdit}
          aria-label="Edit order"
          title="Edit"
        >
          <PencilIcon />
        </button>
      )}
      {canRemove && (
        <button
          type="button"
          className="ifn-icon-btn"
          onClick={onRemoveGroup}
          aria-label="Remove order"
          title="Remove"
        >
          <TrashIcon />
        </button>
      )}
    </div>
  );
}
