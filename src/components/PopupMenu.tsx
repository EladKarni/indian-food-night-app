"use client";

import { useState, useRef, useEffect, ReactNode } from "react";

interface MenuItem {
  label: string;
  onClick: () => void;
  icon?: ReactNode;
  className?: string;
  disabled?: boolean;
}

interface PopupMenuProps {
  items: MenuItem[];
  trigger: ReactNode;
  position?: "bottom-left" | "bottom-right" | "top-left" | "top-right";
  className?: string;
}

const PopupMenu = ({ 
  items, 
  trigger, 
  position = "bottom-right",
  className = "" 
}: PopupMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        triggerRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleTriggerClick = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = (item: MenuItem) => {
    if (!item.disabled) {
      item.onClick();
      setIsOpen(false);
    }
  };

  const getPositionClasses = () => {
    switch (position) {
      case "bottom-left":
        return "top-full left-0 mt-1";
      case "bottom-right":
        return "top-full right-0 mt-1";
      case "top-left":
        return "bottom-full left-0 mb-1";
      case "top-right":
        return "bottom-full right-0 mb-1";
      default:
        return "top-full right-0 mt-1";
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Trigger */}
      <div
        ref={triggerRef}
        onClick={handleTriggerClick}
        className="cursor-pointer"
      >
        {trigger}
      </div>

      {/* Menu */}
      {isOpen && (
        <div
          ref={menuRef}
          className={`absolute z-50 bg-white rounded-lg shadow-lg border border-slate-200 py-1 min-w-[120px] ${getPositionClasses()}`}
        >
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => handleItemClick(item)}
              disabled={item.disabled}
              className={`w-full text-left px-3 py-2 text-sm flex items-center space-x-2 hover:bg-slate-50 transition-colors ${
                item.disabled 
                  ? "text-slate-400 cursor-not-allowed" 
                  : "text-slate-700 hover:text-slate-900"
              } ${item.className || ""}`}
            >
              {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PopupMenu;