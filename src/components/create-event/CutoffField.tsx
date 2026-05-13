"use client";

interface CutoffFieldProps {
  value: number;
  cutoffPreview: string | null;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function CutoffField({
  value,
  cutoffPreview,
  onChange,
}: CutoffFieldProps) {
  return (
    <div>
      <label className="ifn-label" htmlFor="cutoff_minutes_before">
        Order Cut-off
      </label>
      <select
        className="ifn-input"
        id="cutoff_minutes_before"
        name="cutoff_minutes_before"
        value={value}
        onChange={onChange}
      >
        <option value={30}>30 minutes before</option>
        <option value={60}>1 hour before (recommended)</option>
        <option value={90}>90 minutes before</option>
        <option value={120}>2 hours before</option>
        <option value={180}>3 hours before</option>
      </select>
      {cutoffPreview && (
        <p
          style={{
            fontSize: 12,
            color: "var(--ifn-muted)",
            marginTop: 6,
          }}
        >
          Orders close at {cutoffPreview}.
        </p>
      )}
    </div>
  );
}
