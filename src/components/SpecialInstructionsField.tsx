"use client";

interface SpecialInstructionsFieldProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  hintThreshold?: number;
}

export default function SpecialInstructionsField({
  value,
  onChange,
  maxLength = 200,
  hintThreshold = 150,
}: SpecialInstructionsFieldProps) {
  return (
    <>
      <textarea
        className="ifn-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Special instructions (optional)"
        rows={2}
        maxLength={maxLength}
        style={{ resize: "none", fontFamily: "var(--ifn-ui)" }}
      />
      {value.length > hintThreshold && (
        <div className="ifn-meta">
          {maxLength - value.length} characters remaining
        </div>
      )}
    </>
  );
}
