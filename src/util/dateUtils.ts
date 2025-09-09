/**
 * Calculate the date of the next Wednesday from today
 * @returns {string} Formatted date string (e.g., "Dec 11, 2024")
 */
export function getNextWednesday(): string {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const daysUntilWednesday = dayOfWeek <= 3 ? 3 - dayOfWeek : 7 - dayOfWeek + 3;
  
  const nextWednesday = new Date(today);
  nextWednesday.setDate(today.getDate() + daysUntilWednesday);
  
  // Format as "Dec 11, 2024"
  return nextWednesday.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Get a shorter version of the next Wednesday date
 * @returns {string} Formatted date string (e.g., "Dec 11")
 */
export function getNextWednesdayShort(): string {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysUntilWednesday = dayOfWeek <= 3 ? 3 - dayOfWeek : 7 - dayOfWeek + 3;
  
  const nextWednesday = new Date(today);
  nextWednesday.setDate(today.getDate() + daysUntilWednesday);
  
  // Format as "Dec 11"
  return nextWednesday.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
}