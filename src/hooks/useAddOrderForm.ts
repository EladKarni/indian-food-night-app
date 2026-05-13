"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useMenu } from "@/contexts/MenuContext";
import { useActiveEvent } from "@/hooks/useActiveEvent";
import { useAuth } from "@/contexts/AuthContext";
import { useGuestName } from "@/hooks/useGuestName";
import { addOrderUtil } from "@/util/orderUtil";
import { shouldShowSpiceSelector } from "@/util/spiceUtil";
import type { MenuItem } from "@/util/menuData";

interface Options {
  onOrderAdded?: () => Promise<void> | void;
}

export function useAddOrderForm({ onOrderAdded }: Options = {}) {
  const [itemName, setItemName] = useState("");
  const [spiceLevel, setSpiceLevel] = useState(0);
  const [indianHot, setIndianHot] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const autocompleteRef = useRef<HTMLInputElement>(null);

  const { guestName } = useGuestName();
  const { activeEvent } = useActiveEvent();
  const { user } = useAuth();
  const { menuItems, isLoading: menuLoading, error: menuError } = useMenu();

  const senderName =
    user?.user_metadata?.full_name || user?.email || guestName.trim();
  const isMenuDisabled = menuLoading || !!menuError;

  const selectedMenuItem = useMemo(
    () =>
      menuItems.find(
        (item) => item.name.toLowerCase() === itemName.toLowerCase()
      ),
    [menuItems, itemName]
  );

  const handleSpiceLevelChange = useCallback(
    (level: number) => {
      setSpiceLevel(level);
      if (level < 10 && indianHot) {
        setIndianHot(false);
      }
    },
    [indianHot]
  );

  const handleItemSelect = useCallback((selectedItem: MenuItem) => {
    setItemName(selectedItem.name);
    setSpiceLevel(0);
    if (!shouldShowSpiceSelector(selectedItem)) {
      setIndianHot(false);
    }
  }, []);

  const resetForm = () => {
    setItemName("");
    setSpiceLevel(0);
    setIndianHot(false);
    setSpecialInstructions("");
  };

  const submit = useCallback(async () => {
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
      const supportsSpice = shouldShowSpiceSelector(matched);

      await addOrderUtil(
        {
          menu_item_id: matched.id,
          event_id: activeEvent.id,
          spice_level: supportsSpice ? spiceLevel : null,
          is_indian_hot: supportsSpice ? indianHot : false,
          special_instructions: specialInstructions.trim() || null,
        },
        {
          user: orderUser,
          eventId: activeEvent.id,
        }
      );

      await onOrderAdded?.();
      resetForm();
      setTimeout(() => autocompleteRef.current?.focus(), 100);
    } catch (error) {
      console.error("Failed to add order:", error);
    }
  }, [
    menuItems,
    itemName,
    activeEvent,
    user,
    guestName,
    spiceLevel,
    indianHot,
    specialInstructions,
    onOrderAdded,
  ]);

  const submitOnEnter = useCallback(async () => {
    if (itemName.trim()) await submit();
  }, [itemName, submit]);

  const canAdd =
    !!itemName &&
    !!selectedMenuItem &&
    !!activeEvent &&
    (!!user || !!guestName.trim()) &&
    !isMenuDisabled;

  return {
    itemName,
    setItemName,
    spiceLevel,
    setSpiceLevel: handleSpiceLevelChange,
    indianHot,
    setIndianHot,
    specialInstructions,
    setSpecialInstructions,
    autocompleteRef,
    menuItems,
    menuLoading,
    menuError,
    isMenuDisabled,
    selectedMenuItem,
    senderName,
    activeEvent,
    user,
    canAdd,
    handleItemSelect,
    submit,
    submitOnEnter,
  };
}
