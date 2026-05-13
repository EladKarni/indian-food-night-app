"use client";

interface EventDateTimeFieldsProps {
  date: string;
  time: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function EventDateTimeFields({
  date,
  time,
  onChange,
}: EventDateTimeFieldsProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 12,
      }}
    >
      <div>
        <label className="ifn-label" htmlFor="event_date">
          Date
        </label>
        <input
          className="ifn-input"
          id="event_date"
          type="date"
          name="event_date"
          value={date}
          onChange={onChange}
          required
        />
      </div>
      <div>
        <label className="ifn-label" htmlFor="time">
          Time
        </label>
        <input
          className="ifn-input"
          id="time"
          type="time"
          name="time"
          value={time}
          onChange={onChange}
          required
        />
      </div>
    </div>
  );
}
