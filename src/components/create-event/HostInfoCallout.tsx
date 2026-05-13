"use client";

import { HostIcon } from "./icons";

export default function HostInfoCallout() {
  return (
    <div
      className="ifn-card"
      style={{
        marginTop: 22,
        padding: 14,
        background: "var(--ifn-surface-2)",
        borderColor: "transparent",
        display: "flex",
        gap: 12,
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: 8,
          background: "var(--ifn-primary-soft)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <HostIcon />
      </div>
      <div
        style={{
          fontSize: 13,
          color: "var(--ifn-ink-2)",
          lineHeight: 1.45,
        }}
      >
        Once you create the event, everyone in the group can add their order
        until you close it.
      </div>
    </div>
  );
}
