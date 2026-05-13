"use client";

interface LargePartyHintProps {
  uniqueUsers: number;
}

export default function LargePartyHint({ uniqueUsers }: LargePartyHintProps) {
  return (
    <div
      className="ifn-row"
      style={{
        padding: "10px 14px",
        borderRadius: 12,
        background: "var(--ifn-surface-2)",
        marginBottom: 16,
        fontSize: 12.5,
        color: "var(--ifn-ink-2)",
        gap: 8,
      }}
    >
      <span className="ifn-status-dot ifn-status-dot--amber" />
      {uniqueUsers} people tonight — ask for an extra side of rice.
    </div>
  );
}
