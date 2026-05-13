"use client";

import SpiceDots from "@/ui/SpiceDots";

interface OrderListItemSpiceLineProps {
  spiceLevel: number;
  isIndianHot: boolean;
}

export default function OrderListItemSpiceLine({
  spiceLevel,
  isIndianHot,
}: OrderListItemSpiceLineProps) {
  return (
    <div
      style={{
        fontSize: 12,
        color: "var(--ifn-muted)",
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      <SpiceDots level={spiceLevel} />
      <span>
        Spice {spiceLevel}
        {isIndianHot && (
          <span style={{ color: "var(--ifn-chili)" }}> · Indian hot</span>
        )}
      </span>
    </div>
  );
}
