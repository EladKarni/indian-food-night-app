import { supabase } from "@/lib/supabase";

/**
 * Checks if there are any upcoming events in the database
 * @returns Promise<boolean> - True if events exist, false otherwise
 */
export async function checkForEvents() {
  if (!supabase) return false;

  try {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .gte("event_date", "now()")
      .limit(1);

    if (error) {
      console.error("Error checking for events:", error);
      return false;
    }

    return (await data) && data.length > 0;
  } catch (error) {
    console.error("Error checking for events:", error);
    return false;
  }
}
