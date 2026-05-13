"use client";

import { useAddOrderForm } from "@/hooks/useAddOrderForm";
import { shouldShowSpiceSelector } from "@/util/spiceUtil";
import { PlusIcon } from "@/ui/icons";
import AutocompleteInput from "./AutocompleteInput";
import SpiceSelector from "./SpiceSelector";
import SpecialInstructionsField from "./SpecialInstructionsField";
import ReportMenuItemForm from "./ReportMenuItemForm";

interface OrderItemProps {
  onOrderAdded?: () => Promise<void> | void;
}

const OrderItem = ({ onOrderAdded }: OrderItemProps) => {
  const form = useAddOrderForm({ onOrderAdded });

  function renderSelectedItemDetails() {
    if (!form.itemName || !form.selectedMenuItem) return null;
    return (
      <div style={{ marginTop: 12, marginBottom: 12 }}>
        <SpecialInstructionsField
          value={form.specialInstructions}
          onChange={form.setSpecialInstructions}
        />

        {form.activeEvent && (
          <ReportMenuItemForm
            key={form.selectedMenuItem.id}
            menuItemName={form.selectedMenuItem.name}
            menuItemId={form.selectedMenuItem.id}
            eventId={form.activeEvent.id}
            senderName={form.senderName}
            senderId={form.user?.id ?? null}
          />
        )}
      </div>
    );
  }

  return (
    <div className="ifn-card" style={{ padding: 16, marginBottom: 18 }}>
      <div className="ifn-eyebrow" style={{ marginBottom: 10 }}>
        Add a dish
      </div>

      <div style={{ marginBottom: 12 }}>
        <AutocompleteInput
          inputRef={form.autocompleteRef}
          value={form.itemName}
          onChange={form.setItemName}
          onItemSelect={form.handleItemSelect}
          onEnterPressed={form.submitOnEnter}
          items={form.menuItems}
          placeholder="Start typing a dish…"
          disabled={form.isMenuDisabled}
          isLoading={form.menuLoading}
          error={form.menuError || undefined}
        />
      </div>

      <SpiceSelector
        spiceLevel={form.spiceLevel}
        onSpiceLevelChange={form.setSpiceLevel}
        indianHot={form.indianHot}
        onIndianHotChange={form.setIndianHot}
        shouldShow={shouldShowSpiceSelector(form.selectedMenuItem || null)}
      />

      {renderSelectedItemDetails()}

      <button
        type="button"
        onClick={form.submit}
        disabled={!form.canAdd}
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
