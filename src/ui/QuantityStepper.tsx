"use client";

import { MinusIcon, PlusIcon } from "@/ui/icons";

interface QuantityStepperProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  disabled?: boolean;
  minusDisabled?: boolean;
}

export default function QuantityStepper({
  quantity,
  onIncrement,
  onDecrement,
  disabled = false,
  minusDisabled = false,
}: QuantityStepperProps) {
  return (
    <div className="ifn-stepper" role="group" aria-label="Quantity">
      <button
        type="button"
        className="ifn-stepper__btn"
        onClick={onDecrement}
        disabled={disabled || minusDisabled}
        aria-label="Decrease quantity"
      >
        <MinusIcon />
      </button>
      <span className="ifn-stepper__count ifn-num" aria-live="polite">
        {quantity}
      </span>
      <button
        type="button"
        className="ifn-stepper__btn ifn-stepper__btn--primary"
        onClick={onIncrement}
        disabled={disabled}
        aria-label="Increase quantity"
      >
        <PlusIcon color="var(--ifn-bg)" />
      </button>
    </div>
  );
}
