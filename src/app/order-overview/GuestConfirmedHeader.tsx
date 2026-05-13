"use client";

import { CheckIcon } from "@/ui/icons";

interface GuestConfirmedHeaderProps {
  eventLabel: string | null;
}

export default function GuestConfirmedHeader({
  eventLabel,
}: GuestConfirmedHeaderProps) {
  return (
    <div className="ifn-row" style={{ marginBottom: 18, gap: 12 }}>
      <div className="ifn-icon-tile ifn-icon-tile--soft ifn-icon-tile--lg">
        <CheckIcon />
      </div>
      <div>
        <div className="ifn-display" style={{ fontSize: 22, lineHeight: 1.05 }}>
          You&apos;re in.
        </div>
        <div
          style={{ fontSize: 13, color: "var(--ifn-muted)", marginTop: 2 }}
        >
          {eventLabel
            ? `See you ${eventLabel.toLowerCase()}.`
            : "We've got your order."}
        </div>
      </div>
    </div>
  );
}
