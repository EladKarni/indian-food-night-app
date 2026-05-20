"use client";

interface PaidConfirmationCardProps {
  amount: number;
  hostName?: string | null;
}

export default function PaidConfirmationCard({
  amount,
  hostName,
}: PaidConfirmationCardProps) {
  const amountStr = amount.toFixed(2);
  const displayName = hostName?.trim() || "the host";

  return (
    <div
      style={{
        marginTop: 18,
        padding: 18,
        borderRadius: 18,
        background: "linear-gradient(135deg, #1f7a4d 0%, #2fa86a 100%)",
        color: "#fff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          right: -10,
          bottom: -28,
          fontFamily: "var(--ifn-display)",
          fontSize: 160,
          color: "rgba(255,255,255,0.08)",
          lineHeight: 1,
          fontStyle: "italic",
          pointerEvents: "none",
        }}
      >
        ✓
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 12,
          position: "relative",
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: "rgba(255,255,255,0.18)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            fontSize: 20,
            fontWeight: 700,
          }}
        >
          ✓
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 10.5,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              opacity: 0.75,
            }}
          >
            Paid in full
          </div>
          <div
            className="ifn-num ifn-display"
            style={{ fontSize: 30, lineHeight: 1.05, marginTop: 2 }}
          >
            ${amountStr}
          </div>
          <div style={{ fontSize: 12, opacity: 0.85, marginTop: 6 }}>
            Thanks — {displayName} marked your order as paid.
          </div>
        </div>
      </div>
    </div>
  );
}
