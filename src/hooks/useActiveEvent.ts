import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export interface Event {
  id: string;
  title: string;
  description?: string;
  event_date: string;
  start_time: string;
  end_time: string;
  location: string;
  host_id: string;
  host_name: string;
  created_at: string;
  updated_at: string;
}

export const useActiveEvent = () => {
  const [activeEvent, setActiveEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActiveEvent = async () => {
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
    };

    fetchActiveEvent();
  }, []);

  return { activeEvent, loading, error };
};
