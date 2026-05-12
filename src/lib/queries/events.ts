import { supabase } from "@/lib/supabase";
import type { Tables } from "@/types/supabase-types";

export type Event = Tables<"events">;

export async function fetchActiveEvent(): Promise<Event | null> {
  if (!supabase) {
    throw new Error("Supabase client not available");
  }

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .gte("event_date", new Date().toISOString().split("T")[0])
    .limit(1);

  if (error) {
    throw error;
  }

  return data?.[0] ?? null;
}
