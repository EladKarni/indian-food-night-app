"use client";

import CopyIcon from "@/ui/icons/duplicateIcon";
import { useState, useRef, useEffect } from "react";
import { useAutocomplete } from "@/hooks/useAutocomplete";
import { useMenu } from "@/contexts/MenuContext";

interface OrderItemProps {
  id: string;
  initialItemName?: string;
  initialSpiceLevel?: number;
  initialIndianHot?: boolean;
  onDuplicate?: (id: string) => void;
  onRemove?: (id: string) => void;
  onItemChange?: (
    id: string,
    itemName: string,
    spiceLevel: number,
    indianHot: boolean
  ) => void;
}

const OrderItem = ({
  id,
  initialItemName = "",
  initialSpiceLevel = 1,
  initialIndianHot = false,
  onDuplicate,
  onRemove,
  onItemChange,
}: OrderItemProps) => {
  const [itemName, setItemName] = useState(initialItemName);
  const [spiceLevel, setSpiceLevel] = useState(initialSpiceLevel);
  const [indianHot, setIndianHot] = useState(initialIndianHot);
  const inputRef = useRef<HTMLInputElement>(null);

  const { menuItems, isLoading: menuLoading, error: menuError } = useMenu();

  // Show loading state while menu is loading
  const isDisabled = menuLoading || !!menuError;
  const {
    filteredItems,
    showSuggestions,
    setShowSuggestions,
    selectedIndex,
    handleKeyDown,
    selectItem,
  } = useAutocomplete({
    items: menuItems,
    value: itemName,
  });

  const handleDuplicate = () => {
    if (onDuplicate) {
      onDuplicate(id);
    }
  };

  const handleRemove = () => {
    if (onRemove) {
      onRemove(id);
    }
  };

  const handleItemSelect = (selectedItem: any) => {
    setItemName(selectedItem.name);
    setSpiceLevel(selectedItem.spiceLevel);
    setShowSuggestions(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setItemName(value);
    setShowSuggestions(value.trim().length > 0);
  };

  const handleInputFocus = () => {
    if (itemName.trim().length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => setShowSuggestions(false), 150);
  };

  // Notify parent component when item data changes
  useEffect(() => {
    if (onItemChange) {
      onItemChange(id, itemName, spiceLevel, indianHot);
    }
  }, [id, itemName, spiceLevel, indianHot]); // Removed onItemChange from dependencies

  return (
    <div className="bg-slate-500 rounded-2xl p-3 mb-3 shadow-md relative">
      {/* Item Name Input - Top Left */}
      <div className="mb-3 relative">
        <input
          ref={inputRef}
          type="text"
          value={itemName}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={(e) => handleKeyDown(e, handleItemSelect)}
          placeholder={
            menuLoading
              ? "Loading menu..."
              : menuError
              ? "Error loading menu"
              : "Start typing a dish name..."
          }
          className="bg-white text-slate-800 text-sm font-medium px-3 py-1.5 pr-9 rounded-xl border-none outline-none w-full disabled:bg-gray-100 disabled:cursor-not-allowed"
          disabled={isDisabled}
        />
        <div
          className={`absolute right-2 top-1/2 transform -translate-y-1/2 transition-transform ${
            isDisabled
              ? "cursor-not-allowed opacity-50"
              : "cursor-pointer hover:scale-110"
          }`}
          onClick={isDisabled ? undefined : handleDuplicate}
          title={isDisabled ? "Menu loading..." : "Duplicate this item"}
        >
          <CopyIcon height={14} width={14} />
        </div>

        {/* Autocomplete Dropdown */}
        {!isDisabled && showSuggestions && filteredItems.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
            {filteredItems.map((item, index) => (
              <div
                key={item.id}
                className={`px-3 py-2 cursor-pointer text-sm ${
                  index === selectedIndex
                    ? "bg-orange-100 text-orange-800"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
                onClick={() => selectItem(item, handleItemSelect)}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-xs text-slate-500">${item.price}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Show error message if menu failed to load */}
        {menuError && (
          <div className="absolute z-10 w-full mt-1 bg-red-50 border border-red-200 rounded-lg p-2">
            <div className="text-xs text-red-600">{menuError}</div>
          </div>
        )}
      </div>

      {/* Slider and Controls Row */}
      <div className="flex items-center space-x-2">
        <input
          type="range"
          min="1"
          max="10"
          value={spiceLevel}
          onChange={(e) => setSpiceLevel(parseInt(e.target.value))}
          className="flex-1 h-2 bg-slate-400 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #f97316 0%, #f97316 ${
              (spiceLevel - 1) * 11.11
            }%, #94a3b8 ${(spiceLevel - 1) * 11.11}%, #94a3b8 100%)`,
          }}
        />
        <span className="text-orange-400 font-bold text-xl min-w-[20px] text-center">
          {spiceLevel}
        </span>
        <button
          onClick={handleRemove}
          className="w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Remove this item"
          disabled={isDisabled}
        >
          −
        </button>
      </div>

      {/* Indian Hot Checkbox - Only show if spice level is 10 */}
      {spiceLevel === 10 && (
        <div className="mt-2">
          <label className="flex items-center space-x-2 text-xs text-white cursor-pointer">
            <input
              type="checkbox"
              checked={indianHot}
              onChange={(e) => setIndianHot(e.target.checked)}
              className="form-checkbox h-3 w-3 text-orange-500 rounded focus:ring-orange-400 focus:ring-offset-0"
            />
            <span>Indian Hot 🌶️</span>
          </label>
        </div>
      )}

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #f97316;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #f97316;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
};

export default OrderItem;
