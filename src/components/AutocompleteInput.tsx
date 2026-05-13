import { useRef } from "react";
import { useAutocomplete } from "@/hooks/useAutocomplete";

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <circle cx="11" cy="11" r="6.5" stroke="var(--ifn-muted)" strokeWidth="1.6" />
    <path d="M16 16l4 4" stroke="var(--ifn-muted)" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

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
  placeholder = "Start typing…",
  disabled = false,
  isLoading = false,
  error,
  inputRef: externalRef,
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
    setTimeout(() => setShowSuggestions(false), 150);
  };

  const displayPlaceholder = isLoading
    ? "Loading menu…"
    : error
    ? "Error loading menu"
    : placeholder;

  return (
    <div style={{ position: "relative" }}>
      <span
        style={{
          position: "absolute",
          left: 12,
          top: "50%",
          transform: "translateY(-50%)",
          color: "var(--ifn-muted)",
          pointerEvents: "none",
        }}
      >
        <SearchIcon />
      </span>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        onKeyDown={(e) => {
          const hadSuggestions = showSuggestions && filteredItems.length > 0;
          const hadSelection = selectedIndex >= 0;

          handleKeyDown(e, onItemSelect);

          if (e.key === "Enter" && (!hadSuggestions || !hadSelection)) {
            e.preventDefault();
            onEnterPressed?.();
          }
        }}
        placeholder={displayPlaceholder}
        className="ifn-input"
        style={{ paddingLeft: 38 }}
        disabled={disabled}
      />

      {!disabled && showSuggestions && filteredItems.length > 0 && (
        <div
          style={{
            position: "absolute",
            zIndex: 10,
            width: "100%",
            marginTop: 4,
            background: "var(--ifn-surface)",
            border: "1px solid var(--ifn-border)",
            borderRadius: 12,
            boxShadow: "0 8px 24px -8px rgba(26, 23, 20, 0.18)",
            maxHeight: 240,
            overflowY: "auto",
            padding: 4,
          }}
        >
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              className="ifn-row-tap"
              onClick={() => selectItem(item, onItemSelect)}
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 10,
                background:
                  index === selectedIndex
                    ? "var(--ifn-surface-2)"
                    : "transparent",
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{item.name}</div>
              </div>
              <div
                className="ifn-num"
                style={{ fontSize: 13, color: "var(--ifn-muted)" }}
              >
                ${item.price}
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div
          style={{
            position: "absolute",
            zIndex: 10,
            width: "100%",
            marginTop: 4,
            background: "#FBEAE6",
            border: "1px solid #F1B7AD",
            borderRadius: 12,
            padding: 8,
            fontSize: 12,
            color: "var(--ifn-chili)",
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
};

export default AutocompleteInput;
