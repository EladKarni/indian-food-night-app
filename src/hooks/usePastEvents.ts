import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import type { Tables } from "@/types/supabase-types";
import { OrderWithMenuItem } from "./useOrders";

export type Event = Tables<'events'>;

export interface PastEventWithOrders extends Event {
  orders: OrderWithMenuItem[];
  total_spent: number;
  order_count: number;
}

export const usePastEvents = () => {
  const [pastEvents, setPastEvents] = useState<PastEventWithOrders[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchPastEvents = useCallback(async () => {
    if (!supabase || !user) {
      setLoading(false);
      return;
    }

    try {
      const userName = user.user_metadata?.full_name || user.email;
      const today = new Date().toISOString().split("T")[0];

      // Query strategy:
      // 1. Get all past events (event_date < today)
      // 2. Join with orders where user_id = current user OR user_name matches
      // 3. Group by event, calculate totals

      const { data: events, error: eventsError } = await supabase
        .from("events")
        .select(`
          *,
          orders!inner (
            id,
            menu_item_id,
            spice_level,
            is_indian_hot,
            special_instructions,
            created_at,
            user_id,
            user_name,
            is_submitted,
            menu_items (
              id,
              name,
              price,
              description,
              is_vegetarian,
              is_vegan,
              restaurant_name
            )
          )
        `)
        .lt("event_date", today)
        .or(`user_id.eq.${user.id},user_name.eq.${userName}`, { foreignTable: 'orders' })
        .order("event_date", { ascending: false });

      if (eventsError) throw eventsError;

      // Transform data to include totals
      const eventsWithTotals: PastEventWithOrders[] = (events || []).map(event => {
        // Filter orders to only include current user's orders
        const userOrders = (event.orders || []).filter(order =>
          order.user_id === user.id || order.user_name === userName
        ) as OrderWithMenuItem[];

        const totalSpent = userOrders.reduce((sum, order) => {
          const price = order.menu_items?.price || 0;
          return sum + price;
        }, 0);

        return {
          ...event,
          orders: userOrders,
          total_spent: totalSpent,
          order_count: userOrders.length
        };
      });

      setPastEvents(eventsWithTotals);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch past events"
      );
      setPastEvents([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchPastEvents();
  }, [fetchPastEvents]);

  return { pastEvents, loading, error, refetch: fetchPastEvents };
};
