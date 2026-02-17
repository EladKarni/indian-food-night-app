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
