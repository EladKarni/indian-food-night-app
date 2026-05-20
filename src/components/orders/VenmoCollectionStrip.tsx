"use client";

const VenmoIcon = ({ color = "#fff" }: { color?: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={color}>
    <path d="M18.6 3.2c.6 1 .9 2.1.9 3.5 0 4.4-3.8 10-6.9 13.7H6.1L3.5 4.7l5.8-.6 1.4 11c1.3-2.1 2.9-5.3 2.9-7.5 0-1.2-.2-2.1-.6-2.8l5.6-1.6z" />
  </svg>
);

interface VenmoCollectionStripProps {
  collected: number;
  pending: number;
}

export default function VenmoCollectionStrip({
  collected,
  pending,
}: VenmoCollectionStripProps) {
  const total = collected + pending;
  const isFullyCollected = total > 0 && pending <= 0;
  const isEmpty = collected <= 0;
  const pct = total > 0 ? Math.min(100, (collected / total) * 100) : 0;

  const iconTileBg = isFullyCollected
    ? "var(--ifn-pill-green-bg)"
    : "#008CFF";
  const iconColor = isFullyCollected ? "var(--ifn-pill-green-ink)" : "#fff";

  function renderLabel() {
    if (isFullyCollected) {
      return (
        <>
          <div style={{ fontSize: 12, color: "var(--ifn-muted)" }}>
            Venmo collected
          </div>
          <div className="ifn-num" style={{ fontSize: 15, fontWeight: 500 }}>
            All collected · ${total.toFixed(2)}
          </div>
        </>
      );
    }
    if (isEmpty) {
      return (
        <>
          <div style={{ fontSize: 12, color: "var(--ifn-muted)" }}>
            Awaiting Venmos
          </div>
          <div className="ifn-num" style={{ fontSize: 15, fontWeight: 500 }}>
            ${pending.toFixed(2)} pending
          </div>
        </>
      );
    }
    return (
      <>
        <div style={{ fontSize: 12, color: "var(--ifn-muted)" }}>
          Venmo collected
        </div>
        <div className="ifn-num" style={{ fontSize: 15, fontWeight: 500 }}>
          ${collected.toFixed(2)}{" "}
          <span style={{ color: "var(--ifn-subtle)", fontWeight: 400 }}>
            of ${total.toFixed(2)}
          </span>
        </div>
      </>
    );
  }

  return (
    <div
      style={{
        padding: "12px 14px",
        marginBottom: 18,
        borderRadius: 14,
        background: "var(--ifn-surface)",
        border: "1px solid var(--ifn-border)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 10,
            background: iconTileBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transition: "background 150ms ease",
          }}
        >
          <VenmoIcon color={iconColor} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>{renderLabel()}</div>
      </div>
      {!isFullyCollected && (
        <div
          style={{
            marginTop: 10,
            height: 4,
            borderRadius: 999,
            background: "var(--ifn-border)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${pct}%`,
              background: "var(--ifn-primary)",
              transition: "width 200ms ease",
            }}
          />
        </div>
      )}
    </div>
  );
}
