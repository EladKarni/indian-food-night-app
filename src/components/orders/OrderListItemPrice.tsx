"use client";

interface OrderListItemPriceProps {
  unitPrice: number;
  quantity: number;
}

export default function OrderListItemPrice({
  unitPrice,
  quantity,
}: OrderListItemPriceProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        lineHeight: 1.15,
      }}
    >
      <div
        className="ifn-num"
        style={{ fontSize: 13.5, color: "var(--ifn-ink-2)" }}
      >
        ${(unitPrice * quantity).toFixed(2)}
      </div>
      {quantity > 1 && (
        <div
          className="ifn-num"
          style={{
            fontSize: 11,
            color: "var(--ifn-muted)",
            marginTop: 2,
          }}
        >
          ${unitPrice.toFixed(2)} ea
        </div>
      )}
    </div>
  );
}
