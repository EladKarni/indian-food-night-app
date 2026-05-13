import { Tables } from "@/types/supabase-types";

export type Event = Tables<"events">;

export interface CutoffStatus {
  isPastCutoff: boolean;
  cutoffDateTime: Date | null;
  eventDateTime: Date | null;
  minutesUntilCutoff: number | null;
  hoursUntilCutoff: number | null;
}

/**
 * Calculate cutoff status for an event
 * Returns null for events without start_time
 */
export function calculateCutoffStatus(
  event: Event | null
): CutoffStatus | null {
  if (!event || !event.start_time) {
    return null;
  }

  const cutoffMinutes = event.cutoff_minutes_before ?? 60;

  // Parse event datetime (assumes times are in local timezone)
  const [hours, minutes] = event.start_time.split(":").map(Number);
  // Use slash-separated date to force local (not UTC) date parsing
  const eventDateTime = new Date(event.event_date.replace(/-/g, "/"));
  eventDateTime.setHours(hours, minutes, 0, 0);

  // Calculate cutoff datetime
  const cutoffDateTime = new Date(eventDateTime);
  cutoffDateTime.setMinutes(cutoffDateTime.getMinutes() - cutoffMinutes);

  const now = new Date();
  const isPastCutoff = now >= cutoffDateTime;
  const minutesUntilCutoff = Math.floor(
    (cutoffDateTime.getTime() - now.getTime()) / 60000
  );

  return {
    isPastCutoff,
    cutoffDateTime,
    eventDateTime,
    minutesUntilCutoff,
    hoursUntilCutoff:
      minutesUntilCutoff > 0 ? Math.floor(minutesUntilCutoff / 60) : null,
  };
}

/**
 * Format cutoff time for display (12-hour AM/PM format)
 */
export function formatCutoffTime(cutoffDateTime: Date): string {
  const hours = cutoffDateTime.getHours();
  const minutes = cutoffDateTime.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12;
  return `${hour12}:${minutes.toString().padStart(2, "0")} ${ampm}`;
}
