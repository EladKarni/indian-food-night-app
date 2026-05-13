"use client";

import { useCallback, useMemo, useState } from "react";
import { OrderWithMenuItem, UpdateOrderData } from "@/hooks/useOrders";

interface Options {
  userOrders: OrderWithMenuItem[];
  updateOrder: (orderId: string, updates: UpdateOrderData) => Promise<unknown>;
  onComplete?: () => void;
}

export function useFinalizeOrders({
  userOrders,
  updateOrder,
  onComplete,
}: Options) {
  const [finalizing, setFinalizing] = useState(false);

  const allOrdersSubmitted = useMemo(
    () =>
      userOrders.length > 0 && userOrders.every((order) => order.is_submitted),
    [userOrders]
  );

  const finalize = useCallback(async () => {
    if (allOrdersSubmitted) {
      onComplete?.();
      return;
    }
    setFinalizing(true);
    try {
      await Promise.all(
        userOrders.map((order) =>
          updateOrder(order.id, { is_submitted: true })
        )
      );
      onComplete?.();
    } catch (err) {
      console.error("Failed to finalize orders:", err);
      alert("Failed to finalize orders. Please try again.");
      setFinalizing(false);
    }
  }, [allOrdersSubmitted, userOrders, updateOrder, onComplete]);

  return { finalize, finalizing, allOrdersSubmitted };
}
