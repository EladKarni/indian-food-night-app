"use client";

import { useState, useRef } from "react";
import { useMenu } from "@/contexts/MenuContext";
import Button from "@/ui/button";
import { useActiveEvent } from "@/hooks/useActiveEvent";
import { useAuth } from "@/contexts/AuthContext";
import { addOrderUtil } from "@/util/orderUtil";
import { useGuestName } from "@/hooks/useGuestName";
import AutocompleteInput from "./AutocompleteInput";
import SpiceSelector from "./SpiceSelector";
import { shouldShowSpiceSelector } from "@/util/spiceUtil";

interface OrderItemProps {
  onOrderAdded?: () => Promise<void> | void;
}

const OrderItem = ({ onOrderAdded }: OrderItemProps) => {
  const [itemName, setItemName] = useState("");
  const [spiceLevel, setSpiceLevel] = useState(1);
  const [indianHot, setIndianHot] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const { guestName } = useGuestName();
  const { activeEvent } = useActiveEvent();
  const { user } = useAuth();
  const autocompleteRef = useRef<HTMLInputElement>(null);

  const { menuItems, isLoading: menuLoading, error: menuError } = useMenu();

  // Show loading state while menu is loading
  const isDisabled = menuLoading || !!menuError;

  // Get the selected menu item for spice level logic
  const selectedMenuItem = menuItems.find(
    (item) => item.name.toLowerCase() === itemName.toLowerCase()
  );

  const handleItemSelect = (selectedItem: any) => {
    setItemName(selectedItem.name);
    
    // Set spice level to 0 for items that don't need spice levels
    if (!shouldShowSpiceSelector(selectedItem)) {
      setSpiceLevel(0);
      setIndianHot(false);
    } else {
      setSpiceLevel(selectedItem.spiceLevel);
    }
  };

  const handleEnterPressed = async () => {
    // Only add if there's a valid item name
    if (itemName.trim()) {
      await handleAddOrder();
    }
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

      // Use spice level 0 for items that don't need spice levels
      const finalSpiceLevel = shouldShowSpiceSelector(selectedMenuItem) ? spiceLevel : 0;
      const finalIndianHot = shouldShowSpiceSelector(selectedMenuItem) ? indianHot : false;

      await addOrderUtil(
        {
          menu_item_id: selectedMenuItem.id,
          event_id: activeEvent.id,
          spice_level: finalSpiceLevel,
          is_indian_hot: finalIndianHot,
          special_instructions: specialInstructions.trim() || null,
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
      setSpecialInstructions("");
      
      // Refocus the input for quick successive entries
      setTimeout(() => {
        autocompleteRef.current?.focus();
      }, 100);
    } catch (error) {
      console.error("Failed to add order:", error);
    }
  };

  return (
    <div className="bg-slate-500 rounded-2xl p-3 my-4 shadow-md relative">
      {/* Item Name Input - Top Left */}
      <div className="mb-3">
        <AutocompleteInput
          inputRef={autocompleteRef}
          value={itemName}
          onChange={setItemName}
          onItemSelect={handleItemSelect}
          onEnterPressed={handleEnterPressed}
          items={menuItems}
          placeholder="Start typing a dish name..."
          disabled={isDisabled}
          isLoading={menuLoading}
          error={menuError || undefined}
        />
      </div>

      <SpiceSelector
        spiceLevel={spiceLevel}
        onSpiceLevelChange={setSpiceLevel}
        indianHot={indianHot}
        onIndianHotChange={setIndianHot}
        shouldShow={shouldShowSpiceSelector(selectedMenuItem || null)}
      />

      {/* Special Instructions - Show only when item is selected */}
      {itemName && selectedMenuItem && (
        <div className="mb-3">
          <textarea
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            placeholder="Special instructions (optional)"
            className="w-full p-2 border border-slate-400 rounded-lg bg-white text-slate-800 placeholder-slate-500 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-400"
            rows={2}
            maxLength={200}
          />
          {specialInstructions.length > 150 && (
            <div className="text-xs text-slate-600 mt-1">
              {200 - specialInstructions.length} characters remaining
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
    </div>
  );
};

export default OrderItem;
