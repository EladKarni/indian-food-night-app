"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { MenuItem, getAllMenuItems } from '@/util/menuData';

interface MenuContextType {
  menuItems: MenuItem[];
  isLoading: boolean;
  error: string | null;
  refreshMenu: () => Promise<void>;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
};

interface MenuProviderProps {
  children: React.ReactNode;
}

export const MenuProvider: React.FC<MenuProviderProps> = ({ children }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMenuItems = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const items = await getAllMenuItems();
      setMenuItems(items);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load menu items';
      setError(errorMessage);
      console.error('Error loading menu items:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshMenu = async () => {
    await loadMenuItems();
  };

  // Load menu items on mount
  useEffect(() => {
    loadMenuItems();
  }, []);

  const value: MenuContextType = {
    menuItems,
    isLoading,
    error,
    refreshMenu,
  };

  return (
    <MenuContext.Provider value={value}>
      {children}
    </MenuContext.Provider>
  );
};

export default MenuContext;