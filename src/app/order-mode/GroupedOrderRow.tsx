"use client";

import SpiceDots from "@/ui/SpiceDots";
import type { GroupedOrder } from "@/hooks/useGroupedSubmittedOrders";

interface GroupedOrderRowProps {
  group: GroupedOrder;
}

interface VisibleSpice {
  lvl: number;
  count: number;
}

function getVisibleSpiceLevels(group: GroupedOrder): VisibleSpice[] {
  return Object.entries(group.spice_levels)
    .map(([lvl, count]) => ({ lvl: parseInt(lvl, 10), count }))
    .filter((s) => s.lvl > 0)
    .sort((a, b) => a.lvl - b.lvl);
}

export default function GroupedOrderRow({ group }: GroupedOrderRowProps) {
  const spices = getVisibleSpiceLevels(group);
  const hasSpiceMeta = spices.length > 0 || group.indian_hot_count > 0;

  function renderSpiceMeta() {
    if (!hasSpiceMeta) return null;
    return (
      <div
        style={{
          fontSize: 12,
          color: "var(--ifn-muted)",
          marginTop: 4,
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        {spices.map((s) => {
          // Level-10 spice count includes Indian-hot orders — subtract those out
          // so the two are displayed as separate visible counts.
          const visibleCount =
            s.lvl === 10 ? s.count - group.indian_hot_count : s.count;
          if (visibleCount <= 0) return null;
          return (
            <span
              key={s.lvl}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <SpiceDots level={s.lvl} />
              <span>
                {visibleCount}× lvl {s.lvl}
              </span>
            </span>
          );
        })}
        {group.indian_hot_count > 0 && (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              color: "var(--ifn-chili)",
            }}
          >
            <SpiceDots level={10} />
            <span>{group.indian_hot_count}× Indian hot</span>
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "14px 0",
        borderBottom: "1px solid var(--ifn-border)",
      }}
    >
      <div
        className="ifn-num ifn-display"
        style={{
          fontSize: 32,
          width: 44,
          color: "var(--ifn-primary)",
          lineHeight: 1,
        }}
      >
        {group.total_quantity}
        <span style={{ fontSize: 14, color: "var(--ifn-muted)" }}>×</span>
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 500 }}>{group.item_name}</div>
        {renderSpiceMeta()}
      </div>

      <div
        className="ifn-num"
        style={{ fontSize: 13, color: "var(--ifn-muted)" }}
      >
        ${(group.price * group.total_quantity).toFixed(2)}
      </div>
    </div>
  );
}
