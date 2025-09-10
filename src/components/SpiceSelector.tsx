import { SPICY_STUFF_GUILLERMO } from "@/constants/spicyStuffGuillermo";

interface SpiceSelectorProps {
  spiceLevel: number;
  onSpiceLevelChange: (level: number) => void;
  indianHot: boolean;
  onIndianHotChange: (checked: boolean) => void;
}

const SpiceSelector = ({
  spiceLevel,
  onSpiceLevelChange,
  indianHot,
  onIndianHotChange
}: SpiceSelectorProps) => {
  return (
    <div>
      {/* Slider and Controls Row */}
      <div className="flex items-center space-x-2 mb-2">
        <span className="text-xs text-[#FF3B30] min-w-[50px]">Spice Level</span>
        <input
          type="range"
          min="0"
          max="10"
          value={spiceLevel}
          onChange={(e) => onSpiceLevelChange(parseInt(e.target.value))}
          className="flex-1 h-2 bg-slate-400 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #FF3B30 0%, #FF3B30 ${
              spiceLevel * 10
            }%, #94a3b8 ${spiceLevel * 10}%, #94a3b8 100%)`,
          }}
        />
        <span className="text-[#FF3B30] font-bold text-xl min-w-[20px] text-center">
          {spiceLevel}
        </span>
      </div>

      {/* Indian Hot Checkbox - Only show if spice level is 10 */}
      {spiceLevel === 10 && (
        <div className="flex justify-between mt-2 mb-4">
          <label className="flex items-center space-x-2 text-xs text-white cursor-pointer">
            <input
              type="checkbox"
              checked={indianHot}
              onChange={(e) => onIndianHotChange(e.target.checked)}
              className="form-checkbox h-3 w-3 text-orange-500 rounded focus:ring-orange-400 focus:ring-offset-0"
            />
            <span>Indian Hot 🌶️</span>
          </label>
          {indianHot && (
            <div className="text-xs text-[#FF3B30] overflow-auto">
              {
                SPICY_STUFF_GUILLERMO[
                  Math.floor(Math.random() * SPICY_STUFF_GUILLERMO.length)
                ]
              }
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #ff3b30;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #ff3b30;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
};

export default SpiceSelector;