"use client";

interface LocationFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function LocationField({
  value,
  onChange,
}: LocationFieldProps) {
  return (
    <div>
      <label className="ifn-label" htmlFor="location">
        Address
      </label>
      <input
        className="ifn-input"
        id="location"
        type="text"
        name="location"
        value={value}
        onChange={onChange}
        placeholder="2120 Maple Avenue, Apt 4B"
        required
      />
    </div>
  );
}
