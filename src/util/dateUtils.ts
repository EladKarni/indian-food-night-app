/**
 * Returns the date of the next Wednesday (never today, even if today is Wednesday)
 * @returns {string} ISO date string (e.g., "2026-02-18")
 */
export const getNextWednesday = (): string => {
  const WEDNESDAY = 3; // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
  const date = new Date();
  date.setDate(date.getDate() + ((WEDNESDAY + 7 - date.getDay()) % 7) || 7);
  // Use local date parts instead of toISOString() which converts to UTC and can shift the date
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Get a shorter version of the next Wednesday date
 * @returns {string} Formatted date string (e.g., "Feb 18")
 */
export function getNextWednesdayShort(): string {
  const date = new Date(getNextWednesday());
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/**
 * Extract the day-of-month from an ISO date string with the leading zero stripped.
 * @param dateStr - ISO date string (e.g., "2026-02-18")
 * @returns Day of month as string without leading zero (e.g., "18", "4")
 */
export function formatDayOfMonth(dateStr: string): string {
  const [, , d] = dateStr.split("-");
  return d.replace(/^0/, "");
}

/**
 * Parse an ISO date string into a local Date (no UTC drift).
 */
function parseIsoDateLocal(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/**
 * Format an ISO date string as a short month/day label.
 * @param dateStr - ISO date (e.g., "2026-02-18")
 * @returns e.g., "Feb 18"
 */
export function formatEventDate(dateStr: string): string {
  return parseIsoDateLocal(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

/**
 * Format a 24-hour time string as a 12-hour label, or null if no time given.
 * @param time - 24-hour time (e.g., "18:30") or null
 * @returns e.g., "6:30 PM", or null
 */
export function formatEventTime(time: string | null | undefined): string | null {
  if (!time) return null;
  const [hRaw, mRaw] = time.split(":");
  const h = parseInt(hRaw, 10);
  const mer = h >= 12 ? "PM" : "AM";
  const h12 = ((h + 11) % 12) + 1;
  return `${h12}:${mRaw} ${mer}`;
}

/**
 * Combined date + time label used on the order overview topbar.
 * @returns e.g., "Feb 18 · 6:30 PM", or "Feb 18" if no time, or null if no date.
 */
export function formatEventLabel(
  dateStr: string | null | undefined,
  time: string | null | undefined
): string | null {
  if (!dateStr) return null;
  const date = formatEventDate(dateStr);
  const timeLabel = formatEventTime(time);
  return timeLabel ? `${date} · ${timeLabel}` : date;
}
