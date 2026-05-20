"use client";

import { useMemo } from "react";
import { useMenu } from "@/contexts/MenuContext";
import type { MenuItem } from "@/util/menuData";
import MenuPageTopbar from "./MenuPageTopbar";

export default function MenuPage() {
  const { menuItems, isLoading, error } = useMenu();

  const sortedItems = useMemo(
    () => [...menuItems].sort((a, b) => a.name.localeCompare(b.name)),
    [menuItems]
  );

  return (
    <main className="ifn-screen ifn-app">
      <div className="ifn-page-shell">
        <MenuPageTopbar />

        <div className="ifn-screen-pad" style={{ paddingTop: 4 }}>
          {isLoading && <MenuSkeleton />}
          {error && !isLoading && (
            <div className="ifn-card" style={{ padding: 16 }}>
              <div className="ifn-eyebrow" style={{ marginBottom: 6 }}>
                Couldn&apos;t load menu
              </div>
              <div>{error}</div>
            </div>
          )}
          {!isLoading && !error && sortedItems.length === 0 && (
            <div className="ifn-card" style={{ padding: 16 }}>
              No menu items available.
            </div>
          )}
          {!isLoading && !error && sortedItems.length > 0 && (
            <div>
              {sortedItems.map((item) => (
                <MenuRow key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function MenuRow({ item }: { item: MenuItem }) {
  return (
    <div className="ifn-card--row">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          gap: 12,
        }}
      >
        <div style={{ fontWeight: 600 }}>{item.name}</div>
        <div style={{ fontWeight: 600, whiteSpace: "nowrap" }}>
          ${item.price.toFixed(2)}
        </div>
      </div>
      {item.description && (
        <div style={{ fontSize: 14, opacity: 0.8 }}>{item.description}</div>
      )}
      <DietTags vegetarian={item.vegetarian} vegan={item.vegan} />
    </div>
  );
}

function DietTags({
  vegetarian,
  vegan,
}: {
  vegetarian: boolean;
  vegan: boolean;
}) {
  if (!vegetarian && !vegan) return null;
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {vegan ? <Tag label="Vegan" /> : vegetarian ? <Tag label="Veg" /> : null}
    </div>
  );
}

function Tag({ label }: { label: string }) {
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 600,
        padding: "2px 8px",
        borderRadius: 999,
        background: "var(--ifn-surface-2, rgba(0,0,0,0.06))",
      }}
    >
      {label}
    </span>
  );
}

function MenuSkeleton() {
  return (
    <div>
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="ifn-skel"
          style={{ height: 72, borderRadius: 12, marginBottom: 10 }}
        />
      ))}
    </div>
  );
}
