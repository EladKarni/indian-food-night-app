"use client";

import SpiceSelector from "../SpiceSelector";
import SpecialInstructionsField from "../SpecialInstructionsField";

interface OrderListItemEditorProps {
  itemName: string;
  supportsSpice: boolean;
  spiceLevel: number;
  onSpiceLevelChange: (level: number) => void;
  indianHot: boolean;
  onIndianHotChange: (checked: boolean) => void;
  specialInstructions: string;
  onSpecialInstructionsChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  hideDivider?: boolean;
}

const MAX_INSTRUCTIONS = 200;
const INSTRUCTIONS_HINT_THRESHOLD = 150;

export default function OrderListItemEditor({
  itemName,
  supportsSpice,
  spiceLevel,
  onSpiceLevelChange,
  indianHot,
  onIndianHotChange,
  specialInstructions,
  onSpecialInstructionsChange,
  onSave,
  onCancel,
  hideDivider = false,
}: OrderListItemEditorProps) {
  return (
    <div
      style={{
        padding: 16,
        borderBottom: hideDivider ? "none" : "1px solid var(--ifn-border)",
      }}
    >
      <div className="ifn-row-between" style={{ marginBottom: 10 }}>
        <span style={{ fontSize: 14, fontWeight: 500 }}>
          Editing: {itemName}
        </span>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="button"
            onClick={onSave}
            className="ifn-btn ifn-btn--primary ifn-btn--sm"
          >
            Save
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="ifn-btn ifn-btn--ghost ifn-btn--sm"
          >
            Cancel
          </button>
        </div>
      </div>

      {supportsSpice && (
        <SpiceSelector
          spiceLevel={spiceLevel}
          onSpiceLevelChange={onSpiceLevelChange}
          indianHot={indianHot}
          onIndianHotChange={onIndianHotChange}
          shouldShow={true}
        />
      )}

      <SpecialInstructionsField
        value={specialInstructions}
        onChange={onSpecialInstructionsChange}
        maxLength={MAX_INSTRUCTIONS}
        hintThreshold={INSTRUCTIONS_HINT_THRESHOLD}
      />
    </div>
  );
}
