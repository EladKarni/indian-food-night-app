import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import type { Tables } from "@/types/supabase-types";
import { OrderWithMenuItem } from "./useOrders";

export type Event = Tables<'events'>;

export interface AttendeeOrders {
  displayName: string;
  orders: OrderWithMenuItem[];
  subtotal: number;
}

export interface HostPastEvent extends Event {
  allOrders: OrderWithMenuItem[];
  attendeeGroups: AttendeeOrders[];
  grandTotal: number;
  totalItems: number;
  attendeeCount: number;
}

export const useHostPastEvents = () => {
  const [hostPastEvents, setHostPastEvents] = useState<HostPastEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchHostPastEvents = useCallback(async () => {
    if (!supabase || !user) {
      setLoading(false);
      return;
    }

    try {
      const today = new Date().toISOString().split("T")[0];

      const { data: events, error: eventsError } = await supabase
        .from("events")
        .select(`
          *,
          orders (
            id,
            menu_item_id,
            user_id,
            user_name,
            spice_level,
            is_indian_hot,
            special_instructions,
            is_submitted,
            created_at,
            event_id,
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
        .eq("host_id", user.id)
        .lt("event_date", today)
        .order("event_date", { ascending: false });

      if (eventsError) throw eventsError;

      const hostEvents: HostPastEvent[] = (events || []).map(event => {
        const allOrders = (event.orders || []) as OrderWithMenuItem[];

        const groupMap = new Map<string, OrderWithMenuItem[]>();
        for (const order of allOrders) {
          const key = order.user_name || "Guest";
          if (!groupMap.has(key)) groupMap.set(key, []);
          groupMap.get(key)!.push(order);
        }

        const attendeeGroups: AttendeeOrders[] = Array.from(groupMap.entries()).map(
          ([displayName, orders]) => ({
            displayName,
            orders,
            subtotal: orders.reduce((sum, o) => sum + (o.menu_items?.price ?? 0), 0),
          })
        );

        const grandTotal = allOrders.reduce(
          (sum, o) => sum + (o.menu_items?.price ?? 0),
          0
        );

        return {
          ...event,
          allOrders,
          attendeeGroups,
          grandTotal,
          totalItems: allOrders.length,
          attendeeCount: groupMap.size,
        };
      });

      setHostPastEvents(hostEvents);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch hosted events"
      );
      setHostPastEvents([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchHostPastEvents();
  }, [fetchHostPastEvents]);

  return { hostPastEvents, loading, error, refetch: fetchHostPastEvents };
};
