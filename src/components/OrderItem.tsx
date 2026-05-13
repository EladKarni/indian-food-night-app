"use client";

import { useState, useRef } from "react";
import { useMenu } from "@/contexts/MenuContext";
import { useActiveEvent } from "@/hooks/useActiveEvent";
import { useAuth } from "@/contexts/AuthContext";
import { addOrderUtil } from "@/util/orderUtil";
import { useGuestName } from "@/hooks/useGuestName";
import AutocompleteInput from "./AutocompleteInput";
import SpiceSelector from "./SpiceSelector";
import { shouldShowSpiceSelector } from "@/util/spiceUtil";
import ReportMenuItemForm from "./ReportMenuItemForm";

const PlusIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

interface OrderItemProps {
  onOrderAdded?: () => Promise<void> | void;
}

const OrderItem = ({ onOrderAdded }: OrderItemProps) => {
  const [itemName, setItemName] = useState("");
  const [spiceLevel, setSpiceLevel] = useState(0);
  const [indianHot, setIndianHot] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const { guestName } = useGuestName();
  const { activeEvent } = useActiveEvent();
  const { user } = useAuth();
  const autocompleteRef = useRef<HTMLInputElement>(null);

  const handleSpiceLevelChange = (level: number) => {
    setSpiceLevel(level);
    if (level < 10 && indianHot) {
      setIndianHot(false);
    }
  };

  const { menuItems, isLoading: menuLoading, error: menuError } = useMenu();

  const senderName =
    user?.user_metadata?.full_name || user?.email || guestName.trim();

  const isDisabled = menuLoading || !!menuError;

  const selectedMenuItem = menuItems.find(
    (item) => item.name.toLowerCase() === itemName.toLowerCase()
  );

  const handleItemSelect = (selectedItem: any) => {
    setItemName(selectedItem.name);
    if (!shouldShowSpiceSelector(selectedItem)) {
      setSpiceLevel(0);
      setIndianHot(false);
    } else {
      setSpiceLevel(0);
    }
  };

  const handleEnterPressed = async () => {
    if (itemName.trim()) {
      await handleAddOrder();
    }
  };

  const handleAddOrder = async () => {
    const matched = menuItems.find(
      (item) => item.name.toLowerCase() === itemName.toLowerCase()
    );

    if (!matched || !activeEvent) {
      console.error("Missing menu item or active event");
      return;
    }

    if (!user && !guestName.trim()) {
      console.error("Guest name is required when not logged in");
      return;
    }

    try {
      const orderUser = user || {
        email: guestName.trim(),
        user_metadata: { full_name: guestName.trim() },
      };

      const finalSpiceLevel = shouldShowSpiceSelector(matched)
        ? spiceLevel
        : null;
      const finalIndianHot = shouldShowSpiceSelector(matched)
        ? indianHot
        : false;

      await addOrderUtil(
        {
          menu_item_id: matched.id,
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

      if (onOrderAdded) {
        await onOrderAdded();
      }

      setItemName("");
      setSpiceLevel(0);
      setIndianHot(false);
      setSpecialInstructions("");

      setTimeout(() => {
        autocompleteRef.current?.focus();
      }, 100);
    } catch (error) {
      console.error("Failed to add order:", error);
    }
  };

  const canAdd =
    !!itemName &&
    !!selectedMenuItem &&
    !!activeEvent &&
    (!!user || !!guestName.trim()) &&
    !isDisabled;

  return (
    <div className="ifn-card" style={{ padding: 16, marginBottom: 18 }}>
      <div className="ifn-eyebrow" style={{ marginBottom: 10 }}>
        Add a dish
      </div>

      <div style={{ marginBottom: 12 }}>
        <AutocompleteInput
          inputRef={autocompleteRef}
          value={itemName}
          onChange={setItemName}
          onItemSelect={handleItemSelect}
          onEnterPressed={handleEnterPressed}
          items={menuItems}
          placeholder="Start typing a dish…"
          disabled={isDisabled}
          isLoading={menuLoading}
          error={menuError || undefined}
        />
      </div>

      <SpiceSelector
        spiceLevel={spiceLevel}
        onSpiceLevelChange={handleSpiceLevelChange}
        indianHot={indianHot}
        onIndianHotChange={setIndianHot}
        shouldShow={shouldShowSpiceSelector(selectedMenuItem || null)}
      />

      {itemName && selectedMenuItem && (
        <div style={{ marginTop: 12, marginBottom: 12 }}>
          <textarea
            className="ifn-input"
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            placeholder="Special instructions (optional)"
            rows={2}
            maxLength={200}
            style={{ resize: "none", fontFamily: "var(--ifn-ui)" }}
          />
          {specialInstructions.length > 150 && (
            <div
              style={{
                fontSize: 11,
                color: "var(--ifn-muted)",
                marginTop: 4,
              }}
            >
              {200 - specialInstructions.length} characters remaining
            </div>
          )}

          {activeEvent && (
            <ReportMenuItemForm
              key={selectedMenuItem.id}
              menuItemName={selectedMenuItem.name}
              menuItemId={selectedMenuItem.id}
              eventId={activeEvent.id}
              senderName={senderName}
              senderId={user?.id ?? null}
            />
          )}
        </div>
      )}

      <button
        type="button"
        onClick={handleAddOrder}
        disabled={!canAdd}
        className="ifn-btn ifn-btn--ink ifn-btn--full"
        style={{ marginTop: 14 }}
      >
        <PlusIcon />
        Add to order
      </button>
    </div>
  );
};

export default OrderItem;
