"use client";

import Link from "next/link";
import { ChevronIcon, type DashboardIcon } from "./icons";

export interface ActionRow {
  label: string;
  icon: DashboardIcon;
  accent?: boolean;
  danger?: boolean;
  href?: string;
  onClick?: () => void;
}

interface ActionListProps {
  rows: ActionRow[];
}

interface ActionRowContentProps {
  row: ActionRow;
  isLast: boolean;
}

function ActionRowContent({ row, isLast }: ActionRowContentProps) {
  const iconColor = row.danger
    ? "var(--ifn-chili)"
    : row.accent
    ? "var(--ifn-primary)"
    : "var(--ifn-ink-2)";
  const iconBg = row.danger
    ? "#FBEAE6"
    : row.accent
    ? "var(--ifn-primary-soft)"
    : "var(--ifn-surface-2)";

  return (
    <div
      className="ifn-row-tap"
      style={{
        padding: "14px 16px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        borderBottom: isLast ? "none" : "1px solid var(--ifn-border)",
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 10,
          background: iconBg,
          color: iconColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <row.icon color={iconColor} />
      </div>
      <div
        style={{
          flex: 1,
          fontSize: 14.5,
          fontWeight: 500,
          color: row.danger ? "var(--ifn-chili)" : "var(--ifn-ink)",
        }}
      >
        {row.label}
      </div>
      <div style={{ color: "var(--ifn-subtle)" }}>
        <ChevronIcon color="var(--ifn-subtle)" />
      </div>
    </div>
  );
}

export default function ActionList({ rows }: ActionListProps) {
  return (
    <div className="ifn-card" style={{ overflow: "hidden" }}>
      {rows.map((row, i) => {
        const isLast = i === rows.length - 1;
        const content = <ActionRowContent row={row} isLast={isLast} />;

        if (row.href) {
          return (
            <Link
              key={row.label}
              href={row.href}
              style={{ display: "block", color: "inherit" }}
            >
              {content}
            </Link>
          );
        }
        return (
          <button
            key={row.label}
            type="button"
            onClick={row.onClick}
            style={{
              display: "block",
              width: "100%",
              textAlign: "left",
              background: "transparent",
              border: 0,
              padding: 0,
              cursor: "pointer",
              color: "inherit",
            }}
          >
            {content}
          </button>
        );
      })}
    </div>
  );
}
