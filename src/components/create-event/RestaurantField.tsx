"use client";

const DEFAULT_RESTAURANT = "Coriander Indian Grill";

interface RestaurantFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function RestaurantField({
  value,
  onChange,
}: RestaurantFieldProps) {
  const isDefault = value.trim() === DEFAULT_RESTAURANT;

  return (
    <div>
      <label className="ifn-label" htmlFor="restaurant">
        Restaurant
      </label>
      <div style={{ position: "relative" }}>
        <input
          className="ifn-input"
          id="restaurant"
          type="text"
          name="restaurant"
          value={value}
          onChange={onChange}
          placeholder={DEFAULT_RESTAURANT}
          style={{ paddingRight: isDefault ? 76 : 14 }}
        />
        {isDefault && (
          <span
            className="ifn-pill"
            style={{
              position: "absolute",
              right: 8,
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: 10,
            }}
          >
            Default
          </span>
        )}
      </div>
    </div>
  );
}
