"use client";

import { useState, useRef } from "react";
import { useAutocomplete } from "@/hooks/useAutocomplete";
import { useMenu } from "@/contexts/MenuContext";
import Button from "@/ui/button";
import { useActiveEvent } from "@/hooks/useActiveEvent";
import { useAuth } from "@/contexts/AuthContext";
import { addOrderUtil } from "@/util/orderUtil";
import { useGuestName } from "@/hooks/useGuestName";
import { SPICY_STUFF_GUILLERMO } from "@/constants/spicyStuffGuillermo";

interface OrderItemProps {
  onOrderAdded?: () => Promise<void> | void;
}

const OrderItem = ({ onOrderAdded }: OrderItemProps) => {
  const [itemName, setItemName] = useState("");
  const [spiceLevel, setSpiceLevel] = useState(1);
  const [indianHot, setIndianHot] = useState(false);
  const { guestName } = useGuestName();
  const inputRef = useRef<HTMLInputElement>(null);
  const { activeEvent } = useActiveEvent();
  const { user } = useAuth();

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

  const handleAddOrder = async () => {
    const selectedMenuItem = menuItems.find(
      (item) => item.name.toLowerCase() === itemName.toLowerCase()
    );

    if (!selectedMenuItem || !activeEvent) {
      console.error("Missing menu item or active event");
      return;
    }

    // If no user is logged in, require guest name
    if (!user && !guestName.trim()) {
      console.error("Guest name is required when not logged in");
      return;
    }

    try {
      // Create user object for logged in user or guest
      const orderUser = user || {
        id: "guest",
        email: guestName.trim(),
        user_metadata: { full_name: guestName.trim() },
      };

      await addOrderUtil(
        {
          menu_item_id: selectedMenuItem.id,
          event_id: activeEvent.id,
          spice_level: spiceLevel,
          is_indian_hot: indianHot,
        },
        {
          user: orderUser,
          eventId: activeEvent.id,
        }
      );

      // Refresh the orders list
      if (onOrderAdded) {
        await onOrderAdded();
      }

      // Clear the form after successful addition
      setItemName("");
      setSpiceLevel(1);
      setIndianHot(false);
    } catch (error) {
      console.error("Failed to add order:", error);
    }
  };

  return (
    <div className="bg-slate-500 rounded-2xl p-3 my-4 shadow-md relative">
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
          onClick={() => console.log("duplicate")}
          title={isDisabled ? "Menu loading..." : "Duplicate this item"}
        >
          {/* <CopyIcon height={14} width={14} /> */}
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
      <div className="flex items-center space-x-2 mb-2">
        <span className="text-xs text-[#FF3B30] min-w-[50px]">Spice Level</span>
        <input
          type="range"
          min="0"
          max="10"
          value={spiceLevel}
          onChange={(e) => setSpiceLevel(parseInt(e.target.value))}
          className="flex-1 h-2 bg-slate-400 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #FF3B30 0%, #FF3B30 ${
              spiceLevel * 10
            }%, #94a3b8 ${spiceLevel * 10}%, #94a3b8 100%)`,
          }}
        />
        <span className="text-[#FF3B30] font-bold text-xl min-w-[20px] text-center">
          {spiceLevel}
        </span>
      </div>

      {/* Indian Hot Checkbox - Only show if spice level is 10 */}
      {spiceLevel === 10 && (
        <div className="flex justify-between mt-2 mb-4">
          <label className="flex items-center space-x-2 text-xs text-white cursor-pointer">
            <input
              type="checkbox"
              checked={indianHot}
              onChange={(e) => setIndianHot(e.target.checked)}
              className="form-checkbox h-3 w-3 text-orange-500 rounded focus:ring-orange-400 focus:ring-offset-0"
            />
            <span>Indian Hot 🌶️</span>
          </label>
          {indianHot && (
            <div className="text-xs text-[#FF3B30] overflow-auto">
              {
                SPICY_STUFF_GUILLERMO[
                  Math.floor(Math.random() * SPICY_STUFF_GUILLERMO.length)
                ]
              }
            </div>
          )}
        </div>
      )}

      <Button
        fullWidth={true}
        onClick={handleAddOrder}
        disabled={
          !itemName ||
          !activeEvent ||
          (!user && !guestName.trim()) ||
          isDisabled
        }
      >
        Add To Order
      </Button>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #ff3b30;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #ff3b30;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
};

export default OrderItem;
