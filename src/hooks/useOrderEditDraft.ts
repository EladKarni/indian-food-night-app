"use client";

import { useState } from "react";
import { OrderWithMenuItem } from "@/hooks/useOrders";

export type OrderEdits = {
  spice_level?: number;
  is_indian_hot?: boolean;
  special_instructions?: string | null;
};

type Options = {
  order: OrderWithMenuItem;
  onEdit?: (orderId: string, updates: OrderEdits) => Promise<void>;
};

export function useOrderEditDraft({ order, onEdit }: Options) {
  const [isEditing, setIsEditing] = useState(false);
  const [spiceLevel, setSpiceLevel] = useState(order.spice_level || 1);
  const [indianHot, setIndianHot] = useState(order.is_indian_hot || false);
  const [specialInstructions, setSpecialInstructions] = useState(
    order.special_instructions || ""
  );

  const resetFromOrder = () => {
    setSpiceLevel(order.spice_level || 1);
    setIndianHot(order.is_indian_hot || false);
    setSpecialInstructions(order.special_instructions || "");
  };

  const beginEditing = () => {
    resetFromOrder();
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    resetFromOrder();
  };

  const saveEdits = async () => {
    if (!onEdit) return;
    try {
      await onEdit(order.id, {
        spice_level: spiceLevel,
        is_indian_hot: indianHot,
        special_instructions: specialInstructions.trim() || null,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save order edit:", error);
    }
  };

  return {
    isEditing,
    beginEditing,
    cancelEditing,
    saveEdits,
    spiceLevel,
    setSpiceLevel,
    indianHot,
    setIndianHot,
    specialInstructions,
    setSpecialInstructions,
  };
}
