"use client";

import { useCallback } from "react";
import { OrderWithMenuItem, useOrders } from "@/hooks/useOrders";
import { useGuestName } from "@/hooks/useGuestName";
import type { Event } from "@/hooks/useActiveEvent";

type OrderHooks = ReturnType<typeof useOrders>;

export type OrderEditUpdates = {
  spice_level?: number;
  is_indian_hot?: boolean;
  special_instructions?: string | null;
};

interface Options {
  activeEvent: Event | null | undefined;
  ordersHook: OrderHooks;
}

export function useOrderListActions({ activeEvent, ordersHook }: Options) {
  const { addOrder, removeOrder, updateOrder } = ordersHook;
  const { guestName } = useGuestName();

  const handleRemoveOrder = useCallback(
    async (orderId: string) => {
      try {
        await removeOrder(orderId);
      } catch (e) {
        console.error("Failed to remove order:", e);
      }
    },
    [removeOrder]
  );

  const handleDuplicateOrder = useCallback(
    async (order: OrderWithMenuItem) => {
      if (!activeEvent) {
        console.error("Missing active event");
        return;
      }
      try {
        await addOrder(
          {
            menu_item_id: order.menu_item_id,
            event_id: order.event_id,
            spice_level: order.spice_level,
            is_indian_hot: order.is_indian_hot,
            special_instructions: order.special_instructions,
          },
          guestName
        );
      } catch (e) {
        console.error("Failed to duplicate order:", e);
      }
    },
    [activeEvent, addOrder, guestName]
  );

  const handleEditOrder = useCallback(
    async (orderId: string, updates: OrderEditUpdates): Promise<void> => {
      try {
        await updateOrder(orderId, updates);
      } catch (e) {
        console.error("Failed to update order:", e);
        throw e;
      }
    },
    [updateOrder]
  );

  const handleToggleSubmitted = useCallback(
    async (orderId: string, isSubmitted: boolean) => {
      try {
        await updateOrder(orderId, { is_submitted: isSubmitted });
      } catch (e) {
        console.error("Failed to update order status:", e);
      }
    },
    [updateOrder]
  );

  return {
    handleRemoveOrder,
    handleDuplicateOrder,
    handleEditOrder,
    handleToggleSubmitted,
  };
}
