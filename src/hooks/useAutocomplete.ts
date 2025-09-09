import { useState, useEffect, useMemo } from "react";

interface AutocompleteItem {
  id: string;
  name: string;
  description: string;
  price: number;
  spiceLevel: number;
  vegetarian: boolean;
  vegan: boolean;
}

interface UseAutocompleteProps {
  items: AutocompleteItem[];
  value: string;
  maxSuggestions?: number;
}

export function useAutocomplete({
  items,
  value,
  maxSuggestions = 3,
}: UseAutocompleteProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const filteredItems = useMemo(() => {
    if (!value.trim()) return [];

    const searchTerm = value.toLowerCase();
    return items
      .filter((item) => item.name.toLowerCase().includes(searchTerm))
      .slice(0, maxSuggestions);
  }, [items, value, maxSuggestions]);

  const handleKeyDown = (
    e: React.KeyboardEvent,
    onSelect: (item: AutocompleteItem) => void
  ) => {
    if (!showSuggestions || filteredItems.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredItems.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredItems.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && filteredItems[selectedIndex]) {
          onSelect(filteredItems[selectedIndex]);
          setShowSuggestions(false);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const selectItem = (
    item: AutocompleteItem,
    onSelect: (item: AutocompleteItem) => void
  ) => {
    onSelect(item);
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  useEffect(() => {
    setSelectedIndex(-1);
  }, [value]);

  return {
    filteredItems,
    showSuggestions,
    setShowSuggestions,
    selectedIndex,
    handleKeyDown,
    selectItem,
  };
}
