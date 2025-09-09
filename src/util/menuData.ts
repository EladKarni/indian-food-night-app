import { supabase } from "@/lib/supabase";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  spiceLevel: number;
  vegetarian: boolean;
  vegan: boolean;
}

// Cache for menu items from Supabase
let menuItemsCache: MenuItem[] | null = null;
let cacheTimestamp: number | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Helper function to check if cache is still valid
const isCacheValid = (): boolean => {
  return (
    menuItemsCache !== null &&
    cacheTimestamp !== null &&
    Date.now() - cacheTimestamp < CACHE_DURATION
  );
};

// Get menu items from Supabase
export const getAllMenuItems = async (): Promise<MenuItem[]> => {
  // Return cached data if still valid
  // if (isCacheValid()) {
  //   return menuItemsCache!;
  // }

  if (!supabase) {
    throw new Error("Supabase client not available");
  }

  try {
    console.log("Fetching menu items from Supabase...");
    const { data, error } = await supabase.from("menu_items").select("*");

    if (error) {
      console.error("Supabase error details:", error);
      throw new Error(`Supabase error: ${error.message}`);
    }

    if (!data || data.length === 0) {
      console.warn("No menu items found - checking table structure");
      throw new Error("No menu items found in database");
    }

    // Transform Supabase data to match our interface
    menuItemsCache = data.map((item: any) => ({
      id: item.id,
      name: item.name,
      description: item.description || "",
      price: parseFloat(item.price) || 0,
      spiceLevel: item.default_spice_level || item.spice_level || 3,
      vegetarian: item.is_vegetarian || item.vegetarian || false,
      vegan: item.is_vegan || item.vegan || false,
    }));

    cacheTimestamp = Date.now();
    console.log(
      `Successfully loaded ${menuItemsCache.length} menu items from Supabase`
    );
    return menuItemsCache;
  } catch (error) {
    console.error("Failed to fetch menu from Supabase:", error);
    throw error;
  }
};

// Get menu item by name
export const getMenuItemByName = async (
  name: string
): Promise<MenuItem | undefined> => {
  const items = await getAllMenuItems();
  return items.find((item) => item.name.toLowerCase() === name.toLowerCase());
};

// Clear cache (useful for testing or forced refresh)
export const clearMenuCache = (): void => {
  menuItemsCache = null;
  cacheTimestamp = null;
};

// Get cached menu items synchronously (may be null if not loaded)
export const getCachedMenuItems = (): MenuItem[] | null => {
  return isCacheValid() ? menuItemsCache : null;
};

// Preload menu items (useful for app initialization)
export const preloadMenuItems = async (): Promise<void> => {
  try {
    await getAllMenuItems();
  } catch (error) {
    console.error("Failed to preload menu items:", error);
  }
};
