import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Tables, TablesInsert, TablesUpdate } from "@/types/supabase-types";

export type OrderRow = Tables<"orders">;
export type MenuItemRow = Tables<"menu_items">;

export interface OrderWithMenuItem extends OrderRow {
  menu_items: MenuItemRow;
}

export type CreateOrderData = TablesInsert<"orders">;
export type UpdateOrderData = TablesUpdate<"orders">;

export const useOrders = (eventId?: string) => {
  const [orders, setOrders] = useState<OrderWithMenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const { user } = useAuth();

  const fetchOrders = useCallback(async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    try {
      let query = supabase.from("orders").select(`
          *,
          menu_items (*)
        `);

      if (eventId) {
        query = query.eq("event_id", eventId);
      }

      const { data, error } = await query.order("created_at", {
        ascending: false,
      });

      if (error) {
        throw error;
      }

      setOrders(data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const addOrder = useCallback(
    async (orderData: CreateOrderData, guestName?: string) => {
      if (!supabase) {
        throw new Error("Supabase client not available");
      }

      // If no user is logged in, require guest name
      if (!user && !guestName?.trim()) {
        throw new Error("Guest name is required when not logged in");
      }

      setActionLoading(true);
      try {
        const userName = user?.user_metadata?.full_name || user?.email || guestName;
        
        const { data, error } = await supabase
          .from("orders")
          .insert({
            ...orderData,
            user_name: userName,
          })
          .select(
            `
          *,
          menu_items (*)
        `
          )
          .single();

        if (error) {
          throw error;
        }

        setOrders((prev) => [data, ...prev]);
        return data;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to add order";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setActionLoading(false);
      }
    },
    [user]
  );

  const updateOrder = useCallback(
    async (orderId: string, updates: UpdateOrderData) => {
      if (!supabase) {
        throw new Error("Supabase client not available");
      }

      setActionLoading(true);
      try {
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
          throw error;
        }

        setOrders((prev) =>
          prev.map((order) => (order.id === orderId ? data : order))
        );
        return data;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update order";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setActionLoading(false);
      }
    },
    []
  );

  const removeOrder = useCallback(async (orderId: string) => {
    if (!supabase) {
      throw new Error("Supabase client not available");
    }

    setActionLoading(true);
    try {
      const { error } = await supabase
        .from("orders")
        .delete()
        .eq("id", orderId);

      if (error) {
        throw error;
      }

      setOrders((prev) => prev.filter((order) => order.id !== orderId));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to remove order";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setActionLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const refetch = useCallback(async () => {
    setLoading(true);
    await fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    loading,
    actionLoading,
    error,
    addOrder,
    updateOrder,
    removeOrder,
    clearError,
    refetch,
  };
};
