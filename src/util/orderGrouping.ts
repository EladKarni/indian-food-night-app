import { OrderWithMenuItem } from "@/hooks/useOrders";

export type OrdersByUser = Record<string, OrderWithMenuItem[]>;

export type OrderGroup = {
  key: string;
  orders: OrderWithMenuItem[];
  representative: OrderWithMenuItem;
};

export function groupOrdersByUser(orders: OrderWithMenuItem[]): OrdersByUser {
  return orders.reduce((acc, order) => {
    const userName = order.user_name || "Unknown User";
    if (!acc[userName]) {
      acc[userName] = [];
    }
    acc[userName].push(order);
    return acc;
  }, {} as OrdersByUser);
}

export function sumOrderPrices(orders: OrderWithMenuItem[]): number {
  return orders.reduce((sum, o) => sum + o.menu_items.price, 0);
}

function buildVariantKey(order: OrderWithMenuItem): string {
  const spice = order.spice_level ?? "null";
  const indianHot = order.is_indian_hot ? 1 : 0;
  const notes = order.special_instructions ?? "";
  return `${order.menu_item_id}|${spice}|${indianHot}|${notes}`;
}

export function groupOrdersByVariant(
  orders: OrderWithMenuItem[]
): OrderGroup[] {
  const groupsByKey = new Map<string, OrderWithMenuItem[]>();
  const keyOrder: string[] = [];

  for (const order of orders) {
    const key = buildVariantKey(order);
    const existing = groupsByKey.get(key);
    if (existing) {
      existing.push(order);
    } else {
      groupsByKey.set(key, [order]);
      keyOrder.push(key);
    }
  }

  return keyOrder.map((key) => {
    const groupOrders = groupsByKey.get(key) as OrderWithMenuItem[];
    return {
      key,
      orders: groupOrders,
      representative: groupOrders[groupOrders.length - 1],
    };
  });
}
