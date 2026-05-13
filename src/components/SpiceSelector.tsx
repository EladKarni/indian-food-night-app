import IndianHotToggle from "./IndianHotToggle";

interface SpiceSelectorProps {
  spiceLevel: number;
  onSpiceLevelChange: (level: number) => void;
  indianHot: boolean;
  onIndianHotChange: (checked: boolean) => void;
  shouldShow?: boolean;
}

const MAX_SPICE = 10;

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
      <div className="ifn-row-baseline" style={{ marginBottom: 10 }}>
        <span className="ifn-label" style={{ margin: 0 }}>
          Spice level
        </span>
        <span
          style={{ fontSize: 13.5, color: "var(--ifn-ink)", fontWeight: 500 }}
        >
          <span className="ifn-num" style={{ color: "var(--ifn-chili)" }}>
            {spiceLevel}
          </span>
          <span style={{ color: "var(--ifn-subtle)" }}> / {MAX_SPICE}</span>
        </span>
      </div>

      <div
        className="ifn-spice-track"
        style={{ marginBottom: 8, position: "relative" }}
      >
        <div
          className="ifn-spice-fill"
          style={{ width: `${spiceLevel * 10}%` }}
        />
        <div
          className="ifn-spice-thumb"
          style={{ left: `${spiceLevel * 10}%` }}
        />
        <input
          type="range"
          min="0"
          max={MAX_SPICE}
          value={spiceLevel}
          onChange={(e) => onSpiceLevelChange(parseInt(e.target.value, 10))}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: "50%",
            transform: "translateY(-50%)",
            width: "100%",
            height: 32,
            margin: 0,
            opacity: 0,
            cursor: "pointer",
            WebkitAppearance: "none",
          }}
        />
      </div>
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

      {spiceLevel === MAX_SPICE && (
        <IndianHotToggle checked={indianHot} onChange={onIndianHotChange} />
      )}
    </div>
  );
};

export default SpiceSelector;
