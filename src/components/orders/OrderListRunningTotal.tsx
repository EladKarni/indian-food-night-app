"use client";

interface OrderListRunningTotalProps {
  total: number;
}

export default function OrderListRunningTotal({
  total,
}: OrderListRunningTotalProps) {
  return (
    <div className="ifn-row-between" style={{ marginTop: 16 }}>
      <span style={{ fontSize: 13, color: "var(--ifn-muted)" }}>
        Running total
      </span>
      <span className="ifn-num ifn-display" style={{ fontSize: 24 }}>
        ${total.toFixed(2)}
      </span>
    </div>
  );
}
