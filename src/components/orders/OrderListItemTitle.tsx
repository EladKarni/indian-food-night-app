"use client";

interface OrderListItemTitleProps {
  name: string;
  showNotSubmittedTag: boolean;
}

export default function OrderListItemTitle({
  name,
  showNotSubmittedTag,
}: OrderListItemTitleProps) {
  return (
    <div
      style={{
        fontSize: 14.5,
        fontWeight: 500,
        marginBottom: 3,
        color: "var(--ifn-ink)",
      }}
    >
      {name}
      {showNotSubmittedTag && (
        <span
          style={{
            marginLeft: 8,
            fontSize: 11,
            color: "var(--ifn-muted)",
          }}
        >
          (Not submitted)
        </span>
      )}
    </div>
  );
}
