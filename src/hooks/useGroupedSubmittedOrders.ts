"use client";

import { useMemo } from "react";
import { OrderWithMenuItem } from "@/hooks/useOrders";

export interface GroupedOrder {
  item_name: string;
  price: number;
  spice_levels: { [key: string]: number };
  total_quantity: number;
  total_cost: number;
  indian_hot_count: number;
}

const TAX_RATE = 0.07;

export function useGroupedSubmittedOrders(orders: OrderWithMenuItem[]) {
  const submittedOrders = useMemo(
    () => orders.filter((order) => order.is_submitted),
    [orders]
  );

  const groupedOrders = useMemo<GroupedOrder[]>(() => {
    const groups: { [key: string]: GroupedOrder } = {};
    submittedOrders.forEach((order) => {
      const itemName = order.menu_items.name;
      const spiceLevel = order.spice_level?.toString() || "0";
      if (!groups[itemName]) {
        groups[itemName] = {
          item_name: itemName,
          price: order.menu_items.price,
          spice_levels: {},
          total_quantity: 0,
          total_cost: 0,
          indian_hot_count: 0,
        };
      }
      groups[itemName].spice_levels[spiceLevel] =
        (groups[itemName].spice_levels[spiceLevel] || 0) + 1;
      groups[itemName].total_quantity += 1;
      groups[itemName].total_cost += order.menu_items.price;
      if (order.is_indian_hot) {
        groups[itemName].indian_hot_count += 1;
      }
    });
    return Object.values(groups).sort((a, b) =>
      a.item_name.localeCompare(b.item_name)
    );
  }, [submittedOrders]);

  const uniqueUsers = useMemo(() => {
    const userNames = new Set(submittedOrders.map((o) => o.user_name));
    return userNames.size;
  }, [submittedOrders]);

  const subtotal = useMemo(
    () => submittedOrders.reduce((s, o) => s + o.menu_items.price, 0),
    [submittedOrders]
  );

  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  return {
    submittedOrders,
    groupedOrders,
    uniqueUsers,
    subtotal,
    tax,
    total,
  };
}
