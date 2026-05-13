import { useRef } from "react";
import { useAutocomplete } from "@/hooks/useAutocomplete";

interface AutocompleteInputProps {
  value: string;
  onChange: (value: string) => void;
  onItemSelect: (item: any) => void;
  onEnterPressed?: () => void;
  items: any[];
  placeholder?: string;
  disabled?: boolean;
  isLoading?: boolean;
  error?: string;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

const AutocompleteInput = ({
  value,
  onChange,
  onItemSelect,
  onEnterPressed,
  items,
  placeholder = "Start typing...",
  disabled = false,
  isLoading = false,
  error,
  inputRef: externalRef
}: AutocompleteInputProps) => {
  const internalRef = useRef<HTMLInputElement>(null);
  const inputRef = externalRef || internalRef;

  const {
    filteredItems,
    showSuggestions,
    setShowSuggestions,
    selectedIndex,
    handleKeyDown,
    selectItem,
  } = useAutocomplete({
    items,
    value,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setShowSuggestions(newValue.trim().length > 0);
  };

  const handleInputFocus = () => {
    if (value.trim().length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => setShowSuggestions(false), 150);
  };

  const displayPlaceholder = isLoading 
    ? "Loading menu..." 
    : error 
    ? "Error loading menu"
    : placeholder;

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        onKeyDown={(e) => {
          // Handle autocomplete navigation first
          const hadSuggestions = showSuggestions && filteredItems.length > 0;
          const hadSelection = selectedIndex >= 0;
          
          handleKeyDown(e, onItemSelect);
          
          // If Enter was pressed and either no suggestions were shown or no item was selected
          if (e.key === "Enter" && (!hadSuggestions || !hadSelection)) {
            e.preventDefault();
            onEnterPressed?.();
          }
        }}
        placeholder={displayPlaceholder}
        className="bg-white text-slate-800 text-sm font-medium px-3 py-1.5 pr-9 rounded-xl border-none outline-none w-full disabled:bg-gray-100 disabled:cursor-not-allowed"
        disabled={disabled}
      />
      
      <div
        className={`absolute right-2 top-1/2 transform -translate-y-1/2 transition-transform ${
          disabled
            ? "cursor-not-allowed opacity-50"
            : "cursor-pointer hover:scale-110"
        }`}
        onClick={() => console.log("duplicate")}
        title={disabled ? "Menu loading..." : "Duplicate this item"}
      >
        {/* Icon placeholder - could use the Icon component here */}
      </div>

      {/* Autocomplete Dropdown */}
      {!disabled && showSuggestions && filteredItems.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              className={`px-3 py-2 cursor-pointer text-sm ${
                index === selectedIndex
                  ? "bg-orange-100 text-orange-800"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
              onClick={() => selectItem(item, onItemSelect)}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">{item.name}</span>
                <span className="text-xs text-slate-500">${item.price}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Show error message if menu failed to load */}
      {error && (
        <div className="absolute z-10 w-full mt-1 bg-red-50 border border-red-200 rounded-lg p-2">
          <div className="text-xs text-red-600">{error}</div>
        </div>
      )}
    </div>
  );
};

export default AutocompleteInput;