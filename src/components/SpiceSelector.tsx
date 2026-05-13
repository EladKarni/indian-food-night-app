import { SPICY_STUFF_GUILLERMO } from "@/constants/spicyStuffGuillermo";

interface SpiceSelectorProps {
  spiceLevel: number;
  onSpiceLevelChange: (level: number) => void;
  indianHot: boolean;
  onIndianHotChange: (checked: boolean) => void;
  shouldShow?: boolean;
}

const SpiceSelector = ({
  spiceLevel,
  onSpiceLevelChange,
  indianHot,
  onIndianHotChange,
  shouldShow = true,
}: SpiceSelectorProps) => {
  if (!shouldShow) {
    return null;
  }

  return (
    <div style={{ marginBottom: 14 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 10,
        }}
      >
        <span className="ifn-label" style={{ margin: 0 }}>
          Spice level
        </span>
        <span
          style={{
            fontSize: 13.5,
            color: "var(--ifn-ink)",
            fontWeight: 500,
          }}
        >
          <span className="ifn-num" style={{ color: "var(--ifn-chili)" }}>
            {spiceLevel}
          </span>
          <span style={{ color: "var(--ifn-subtle)" }}> / 10</span>
        </span>
      </div>

      <div className="ifn-spice-track" style={{ marginBottom: 8 }}>
        <div
          className="ifn-spice-fill"
          style={{ width: `${spiceLevel * 10}%` }}
        />
        <div
          className="ifn-spice-thumb"
          style={{ left: `${spiceLevel * 10}%` }}
        />
      </div>
      <input
        type="range"
        min="0"
        max="10"
        value={spiceLevel}
        onChange={(e) => onSpiceLevelChange(parseInt(e.target.value, 10))}
        style={{
          width: "100%",
          opacity: 0,
          position: "relative",
          marginTop: -16,
          height: 24,
          cursor: "pointer",
        }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 10.5,
          color: "var(--ifn-muted)",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        <span>Mild</span>
        <span>Medium</span>
        <span>Indian Hot</span>
      </div>

      {spiceLevel === 10 && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            marginTop: 10,
          }}
        >
          <label
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontSize: 12,
              color: "var(--ifn-ink-2)",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={indianHot}
              onChange={(e) => onIndianHotChange(e.target.checked)}
              style={{ accentColor: "var(--ifn-chili)" }}
            />
            <span>Indian Hot</span>
          </label>
          {indianHot && (
            <div
              style={{
                fontSize: 11,
                color: "var(--ifn-chili)",
                textAlign: "right",
                flex: 1,
              }}
            >
              {
                SPICY_STUFF_GUILLERMO[
                  Math.floor(Math.random() * SPICY_STUFF_GUILLERMO.length)
                ]
              }
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SpiceSelector;
