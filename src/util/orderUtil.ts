import { supabase } from "@/lib/supabase";
import { CreateOrderData, OrderWithMenuItem } from "@/hooks/useOrders";

type User = {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
  };
};

export interface OrderUtilOptions {
  user: User;
  eventId: string;
}

/**
 * Add a new order to the database
 */
export const addOrderUtil = async (
  orderData: CreateOrderData,
  options: OrderUtilOptions
): Promise<OrderWithMenuItem> => {
  if (!supabase) {
    throw new Error("Supabase client not available");
  }

  const { data, error } = await supabase
    .from("orders")
    .insert({
      ...orderData,
      user_name: options.user.user_metadata?.full_name || options.user.email,
    })
    .select(
      `
      *,
      menu_items (*)
    `
    )
    .single();

  if (error) {
    throw new Error(`Failed to add order: ${error.message}`);
  }

  return data;
};

/**
 * Remove an order from the database
 */
export const removeOrderUtil = async (orderId: string): Promise<void> => {
  if (!supabase) {
    throw new Error("Supabase client not available");
  }
  const { error } = await supabase.from("orders").delete().eq("id", orderId);

  if (error) {
    throw new Error(`Failed to remove order: ${error.message}`);
  }
};

/**
 * Add a simple order to the database without returning data
 */
export const addOrderSimpleUtil = async (orderData: CreateOrderData, userName?: string): Promise<void> => {
  if (!supabase) {
    throw new Error("Supabase client not available");
  }

  const { error } = await supabase
    .from("orders")
    .insert({
      ...orderData,
      user_name: userName,
    });

  if (error) {
    throw new Error(`Failed to add order: ${error.message}`);
  }
};

/**
 * Duplicate an existing order
 */
export const duplicateOrderUtil = async (
  originalOrder: OrderWithMenuItem,
  options: OrderUtilOptions
): Promise<OrderWithMenuItem> => {
  if (!supabase) {
    throw new Error("Supabase client not available");
  }

  // Create a new order with the same data but without the ID and timestamps
  const duplicateData: CreateOrderData = {
    menu_item_id: originalOrder.menu_item_id,
    event_id: originalOrder.event_id,
    spice_level: originalOrder.spice_level,
    is_indian_hot: originalOrder.is_indian_hot,
    special_instructions: originalOrder.special_instructions,
  };

  const { data, error } = await supabase
    .from("orders")
    .insert({
      ...duplicateData,
      user_name: options.user.user_metadata?.full_name || options.user.email,
    })
    .select(
      `
      *,
      menu_items (*)
    `
    )
    .single();

  if (error) {
    throw new Error(`Failed to duplicate order: ${error.message}`);
  }

  return data;
};

/**
 * Update an existing order
 */
export const updateOrderUtil = async (
  orderId: string,
  updates: Partial<CreateOrderData>
): Promise<OrderWithMenuItem> => {
  if (!supabase) {
    throw new Error("Supabase client not available");
  }

  const { data, error } = await supabase
    .from("orders")
    .update(updates)
    .eq("id", orderId)
    .select(
      `
      *,
      menu_items (*)
    `
    )
    .single();

  if (error) {
    throw new Error(`Failed to update order: ${error.message}`);
  }

  return data;
};

/**
 * Get all orders for a specific event
 */
export const getOrdersByEventUtil = async (
  eventId: string
): Promise<OrderWithMenuItem[]> => {
  if (!supabase) {
    throw new Error("Supabase client not available");
  }

  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      menu_items (*)
    `
    )
    .eq("event_id", eventId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch orders: ${error.message}`);
  }

  return data || [];
};

/**
 * Get all orders for a specific user
 */
export const getOrdersByUserUtil = async (
  userName: string
): Promise<OrderWithMenuItem[]> => {
  if (!supabase) {
    throw new Error("Supabase client not available");
  }

  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      menu_items (*)
    `
    )
    .eq("user_name", userName)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch orders: ${error.message}`);
  }

  return data || [];
};
