"use client";

import { CheckIcon } from "@/ui/icons";

interface FinalizeOrderButtonProps {
  finalizing: boolean;
  allOrdersSubmitted: boolean;
  onClick: () => void;
}

export default function FinalizeOrderButton({
  finalizing,
  allOrdersSubmitted,
  onClick,
}: FinalizeOrderButtonProps) {
  const label = finalizing
    ? "Finalizing…"
    : allOrdersSubmitted
    ? "Order overview"
    : "Finalize my order";

  return (
    <button
      type="button"
      className="ifn-btn ifn-btn--primary ifn-btn--full"
      style={{ marginTop: 16 }}
      disabled={finalizing}
      onClick={onClick}
    >
      <CheckIcon color="#fff" size={16} />
      {label}
    </button>
  );
}
