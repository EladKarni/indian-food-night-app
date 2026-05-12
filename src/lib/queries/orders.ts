import { supabase } from "@/lib/supabase";
import type { Tables } from "@/types/supabase-types";

export type OrderRow = Tables<"orders">;
export type MenuItemRow = Tables<"menu_items">;

export interface OrderWithMenuItem extends OrderRow {
  menu_items: MenuItemRow;
}

export async function fetchOrdersByEvent(
  eventId: string
): Promise<OrderWithMenuItem[]> {
  if (!supabase) {
    throw new Error("Supabase client not available");
  }

  const { data, error } = await supabase
    .from("orders")
    .select("*, menu_items (*)")
    .eq("event_id", eventId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
}
