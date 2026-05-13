"use client";

interface OrderListItemSubmitToggleProps {
  isSubmitted: boolean;
  onToggle: () => void;
}

export default function OrderListItemSubmitToggle({
  isSubmitted,
  onToggle,
}: OrderListItemSubmitToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={
        isSubmitted ? "ifn-pill ifn-pill--green" : "ifn-pill ifn-pill--accent"
      }
      style={{ fontSize: 10 }}
      title={isSubmitted ? "Mark as not submitted" : "Mark as submitted"}
    >
      {isSubmitted ? "Submitted" : "Pending"}
    </button>
  );
}
