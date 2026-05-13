"use client";

import { AppPhoneIcon } from "@/ui/icons";

interface RestaurantCalloutProps {
  restaurant: string;
  phone: string;
}

export default function RestaurantCallout({
  restaurant,
  phone,
}: RestaurantCalloutProps) {
  return (
    <div
      className="ifn-card"
      style={{
        padding: 14,
        marginBottom: 16,
        background: "var(--ifn-primary-soft)",
        borderColor: "transparent",
      }}
    >
      <div className="ifn-row" style={{ gap: 12 }}>
        <div className="ifn-icon-tile ifn-icon-tile--primary">
          <AppPhoneIcon />
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 13.5,
              fontWeight: 500,
              color: "var(--ifn-ink)",
            }}
          >
            {restaurant}
          </div>
          <div
            className="ifn-num"
            style={{ fontSize: 12, color: "var(--ifn-ink-2)" }}
          >
            {phone}
          </div>
        </div>
        <a
          href={`tel:${phone.replace(/[^0-9]/g, "")}`}
          className="ifn-btn ifn-btn--primary ifn-btn--sm"
          style={{ textDecoration: "none" }}
        >
          Call
        </a>
      </div>
    </div>
  );
}
