import { supabase } from "@/lib/supabase";
import { OrderWithMenuItem } from "@/hooks/useOrders";
import { TablesInsert } from "@/types/supabase-types";

type User = {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
  };
};

export interface ReorderOptions {
  user: User;
  targetEventId: string;
  sourceOrders: OrderWithMenuItem[];
  selectedOrderIds?: string[]; // For selective re-ordering
}

/**
 * Bulk re-order all items from a past event to current active event
 */
export const bulkReorderUtil = async (
  options: ReorderOptions
): Promise<void> => {
  if (!supabase) {
    throw new Error("Supabase client not available");
  }

  const { user, targetEventId, sourceOrders } = options;
  const userName = user.user_metadata?.full_name || user.email;

  // Create new orders for all items
  const ordersToInsert: TablesInsert<'orders'>[] = sourceOrders.map(order => ({
    menu_item_id: order.menu_item_id,
    event_id: targetEventId,
    spice_level: order.spice_level,
    is_indian_hot: order.is_indian_hot,
    special_instructions: order.special_instructions,
    user_name: userName,
    user_id: user.id,
    is_submitted: false,
  }));

  const { error } = await supabase
    .from("orders")
    .insert(ordersToInsert);

  if (error) {
    throw new Error(`Failed to re-order items: ${error.message}`);
  }
};

/**
 * Re-order selected items from a past event
 */
export const selectiveReorderUtil = async (
  options: ReorderOptions
): Promise<void> => {
  if (!supabase) {
    throw new Error("Supabase client not available");
  }

  const { user, targetEventId, sourceOrders, selectedOrderIds } = options;

  if (!selectedOrderIds || selectedOrderIds.length === 0) {
    throw new Error("No orders selected for re-ordering");
  }

  const userName = user.user_metadata?.full_name || user.email;

  // Filter to only selected orders
  const selectedOrders = sourceOrders.filter(order =>
    selectedOrderIds.includes(order.id)
  );

  const ordersToInsert: TablesInsert<'orders'>[] = selectedOrders.map(order => ({
    menu_item_id: order.menu_item_id,
    event_id: targetEventId,
    spice_level: order.spice_level,
    is_indian_hot: order.is_indian_hot,
    special_instructions: order.special_instructions,
    user_name: userName,
    user_id: user.id,
    is_submitted: false,
  }));

  const { error } = await supabase
    .from("orders")
    .insert(ordersToInsert);

  if (error) {
    throw new Error(`Failed to re-order selected items: ${error.message}`);
  }
};
