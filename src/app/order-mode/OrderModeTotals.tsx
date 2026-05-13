"use client";

interface OrderModeTotalsProps {
  itemCount: number;
  subtotal: number;
  tax: number;
  total: number;
}

export default function OrderModeTotals({
  itemCount,
  subtotal,
  tax,
  total,
}: OrderModeTotalsProps) {
  return (
    <>
      <div
        className="ifn-num"
        style={{
          marginTop: 16,
          fontSize: 13,
          color: "var(--ifn-muted)",
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        <div className="ifn-totals-row">
          <span>Subtotal · {itemCount} items</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="ifn-totals-row">
          <span>Tax (7%)</span>
          <span>${tax.toFixed(2)}</span>
        </div>
      </div>
      <div
        className="ifn-display ifn-num"
        style={{
          marginTop: 12,
          paddingTop: 14,
          borderTop: "1px solid var(--ifn-border)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <span style={{ fontSize: 18, color: "var(--ifn-ink-2)" }}>Total</span>
        <span style={{ fontSize: 36 }}>${total.toFixed(2)}</span>
      </div>
    </>
  );
}
