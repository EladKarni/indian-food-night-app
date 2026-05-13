"use client";

import { useMemo } from "react";
import { SPICY_STUFF_GUILLERMO } from "@/constants/spicyStuffGuillermo";

interface IndianHotToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export default function IndianHotToggle({
  checked,
  onChange,
}: IndianHotToggleProps) {
  // Pick a random message once per "checked" transition so the message stays
  // stable while the box is ticked instead of rerolling on every parent render
  // (which previously made it flicker on every keystroke in a parent input).
  const message = useMemo(() => {
    if (!checked) return null;
    return SPICY_STUFF_GUILLERMO[
      Math.floor(Math.random() * SPICY_STUFF_GUILLERMO.length)
    ];
  }, [checked]);

  return (
    <div
      className="ifn-row-between"
      style={{ gap: 12, marginTop: 10 }}
    >
      <label
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          fontSize: 12,
          color: "var(--ifn-ink-2)",
          cursor: "pointer",
        }}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          style={{ accentColor: "var(--ifn-chili)" }}
        />
        <span>Indian Hot</span>
      </label>
      {message && (
        <div
          style={{
            fontSize: 11,
            color: "var(--ifn-chili)",
            textAlign: "right",
            flex: 1,
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
}
