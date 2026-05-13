"use client";

interface OrderListHeaderProps {
  title: string;
  itemCount: number;
  showEditToggle: boolean;
  isEditMode: boolean;
  onToggleEditMode: () => void;
}

export default function OrderListHeader({
  title,
  itemCount,
  showEditToggle,
  isEditMode,
  onToggleEditMode,
}: OrderListHeaderProps) {
  function renderTrailing() {
    if (showEditToggle) {
      return (
        <button
          type="button"
          onClick={onToggleEditMode}
          className={isEditMode ? "ifn-pill ifn-pill--accent" : "ifn-pill"}
          style={{ fontSize: 11 }}
        >
          {isEditMode ? "Done editing" : "Edit status"}
        </button>
      );
    }
    return (
      <div
        className="ifn-num"
        style={{ fontSize: 12.5, color: "var(--ifn-muted)" }}
      >
        {itemCount} {itemCount === 1 ? "item" : "items"}
      </div>
    );
  }

  return (
    <div className="ifn-row-baseline" style={{ marginBottom: 12 }}>
      <div className="ifn-display" style={{ fontSize: 22 }}>
        {title}
      </div>
      {renderTrailing()}
    </div>
  );
}
