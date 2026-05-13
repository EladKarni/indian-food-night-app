import { supabase } from "@/lib/supabase";
import type { TablesInsert } from "@/types/supabase-types";

export type SubmitHostMessageInput = {
  eventId: string;
  menuItemId: string | null;
  senderName: string;
  senderId: string | null;
  message: string;
};

/**
 * Submits a guest-to-host message (menu item report or general note).
 * Throws if the Supabase client is unavailable or if the insert fails.
 */
export async function submitHostMessage(
  input: SubmitHostMessageInput
): Promise<void> {
  if (!supabase) throw new Error("Supabase client not available");

  const payload: TablesInsert<"host_messages"> = {
    event_id: input.eventId,
    menu_item_id: input.menuItemId,
    sender_name: input.senderName,
    sender_id: input.senderId,
    message: input.message,
  };

  const { error } = await supabase.from("host_messages").insert(payload);

  if (error) {
    throw new Error(`Failed to submit message: ${error.message}`);
  }
}
