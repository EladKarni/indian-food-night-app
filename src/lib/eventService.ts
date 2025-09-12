import { supabase } from "@/lib/supabase";
import type { TablesUpdate } from "@/types/supabase-types";

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

    return data && data.length > 0;
  } catch (error) {
    console.error("Error checking for events:", error);
    return false;
  }
}

/**
 * Updates an existing event
 * @param eventId - The ID of the event to update
 * @param updates - The fields to update
 * @param userId - The ID of the user making the update (for authorization)
 * @returns Promise with updated event data or error
 */
export async function updateEvent(
  eventId: string,
  updates: TablesUpdate<"events">,
  userId: string
) {
  if (!supabase) throw new Error("Supabase client not available");

  try {
    // First verify the user is the host of this event
    const { data: existingEvent, error: fetchError } = await supabase
      .from("events")
      .select("host_id")
      .eq("id", eventId)
      .single();

    if (fetchError) {
      throw new Error(`Failed to fetch event: ${fetchError.message}`);
    }

    if (!existingEvent) {
      throw new Error("Event not found");
    }

    if (existingEvent.host_id !== userId) {
      throw new Error("You are not authorized to edit this event");
    }

    // Update the event with current timestamp
    const { data, error } = await supabase
      .from("events")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", eventId)
      .select();

    if (error) {
      throw new Error(`Failed to update event: ${error.message}`);
    }

    return { data: data?.[0] || null, error: null };
  } catch (error) {
    console.error("Error updating event:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to update event",
    };
  }
}
