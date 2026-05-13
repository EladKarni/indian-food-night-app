import { OrderWithMenuItem } from "@/hooks/useOrders";

export type OrdersByUser = Record<string, OrderWithMenuItem[]>;

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
