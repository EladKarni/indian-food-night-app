/**
 * Time utility functions for parsing and formatting times
 * Consolidates time-related logic used across the application
 */

/**
 * Parse 24-hour time string (HH:MM) to hours and minutes
 * @param time24 - Time string in 24-hour format (e.g., "18:30")
 * @returns Object with hours and minutes as numbers
 */
export function parseTime24(time24: string): { hours: number; minutes: number } {
  const [hours, minutes] = time24.split(':').map(Number);
  return { hours, minutes };
}

/**
 * Format 24-hour time string to 12-hour AM/PM format
 * @param time24 - Time string in 24-hour format (e.g., "18:30")
 * @returns Formatted time string (e.g., "6:30 PM")
 */
export function formatTimeToAMPM(time24: string): string {
  const { hours, minutes } = parseTime24(time24);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  return `${hour12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
}

/**
 * Format Date object to 12-hour AM/PM time format
 * @param date - Date object to format
 * @returns Formatted time string (e.g., "6:30 PM")
 */
export function formatDateTimeToAMPM(date: Date): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  return `${hour12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
}

/**
 * Calculate and format cutoff time display string
 * @param eventDate - Event date in YYYY-MM-DD format
 * @param eventTime - Event time in HH:MM format
 * @param cutoffMinutesBefore - Minutes before event when cutoff occurs
 * @returns Formatted cutoff time string (e.g., "5:30 PM")
 */
export function calculateCutoffTimeString(
  eventDate: string,
  eventTime: string,
  cutoffMinutesBefore: number
): string {
  const { hours, minutes } = parseTime24(eventTime);
  const eventDateTime = new Date(eventDate);
  eventDateTime.setHours(hours, minutes, 0, 0);

  const cutoffDateTime = new Date(eventDateTime);
  cutoffDateTime.setMinutes(cutoffDateTime.getMinutes() - cutoffMinutesBefore);

  return formatDateTimeToAMPM(cutoffDateTime);
}
