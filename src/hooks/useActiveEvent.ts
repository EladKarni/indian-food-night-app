import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { Tables } from "@/types/supabase-types";

export type Event = Tables<'events'>;

export const useActiveEvent = () => {
  const [activeEvent, setActiveEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActiveEvent = useCallback(async () => {
    setLoading(true);
    if (!supabase) {
      setLoading(false);
      return;
    }

    try {
      const { data: events, error } = await supabase
        .from("events")
        .select("*")
        .gte("event_date", new Date().toISOString().split("T")[0])
        .limit(1);


      if (error) {
        throw error;
      }

      setActiveEvent(events?.[0] || null);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch active event"
      );
      setActiveEvent(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshActiveEvent = useCallback(() => {
    fetchActiveEvent();
  }, [fetchActiveEvent]);

  useEffect(() => {
    fetchActiveEvent();
  }, [fetchActiveEvent]);

  return { activeEvent, loading, error, refreshActiveEvent };
};
