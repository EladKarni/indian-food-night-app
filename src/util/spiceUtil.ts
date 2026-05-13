import { MenuItem } from "./menuData";

/**
 * Items that typically don't have adjustable spice levels
 * Based on common Indian restaurant menu categories
 */
const NON_SPICED_ITEM_PATTERNS = [
  // Drinks
  /lassi/i,
  /chai/i, 
  /tea/i,
  /coffee/i,
  /juice/i,
  /soda/i,
  /water/i,
  /drink/i,
  /beverage/i,
  
  // Bread & Rice (plain varieties)
  /naan/i,
  /roti/i,
  /chapati/i,
  /paratha/i,
  /kulcha/i,
  /bread/i,
  /rice/i,
  /biryani/i, // Biryani is pre-spiced to specific levels
  
  // Desserts
  /kulfi/i,
  /gulab/i,
  /kheer/i,
  /halwa/i,
  /dessert/i,
  /sweet/i,
  /ice cream/i,
  
  // Appetizers/Sides that are typically pre-prepared
  /papadum/i,
  /papad/i,
  /pickle/i,
  /chutney/i,
  /raita/i,
  /yogurt/i,
  /salad/i
];

/**
 * Determines if a menu item should show spice level controls
 * @param menuItem - The menu item to check
 * @returns true if spice selector should be shown, false otherwise
 */
export const shouldShowSpiceSelector = (menuItem: MenuItem | null): boolean => {
  if (!menuItem) {
    return false;
  }

  // Check if the item name matches any non-spiced patterns
  const itemName = menuItem.name.toLowerCase();
  
  for (const pattern of NON_SPICED_ITEM_PATTERNS) {
    if (pattern.test(itemName)) {
      return false;
    }
  }

  // If no patterns match, assume it can have spice levels
  return true;
};

/**
 * Gets a list of all patterns used to identify non-spiced items
 * Useful for debugging or configuration
 */
export const getNonSpicedPatterns = (): RegExp[] => {
  return NON_SPICED_ITEM_PATTERNS;
};