"use client";

import { useState, useRef, useEffect, ReactNode, useLayoutEffect } from "react";
import { createPortal } from "react-dom";

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

const MENU_WIDTH = 160;
const MENU_GAP = 6;

const PopupMenu = ({
  items,
  trigger,
  position = "bottom-right",
  className = "",
}: PopupMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(
    null
  );
  const [mounted, setMounted] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (!isOpen || !triggerRef.current) return;

    const updatePosition = () => {
      const rect = triggerRef.current!.getBoundingClientRect();
      const menuHeight = menuRef.current?.offsetHeight ?? 0;
      const menuWidth = menuRef.current?.offsetWidth ?? MENU_WIDTH;

      let top = 0;
      let left = 0;

      switch (position) {
        case "bottom-left":
          top = rect.bottom + MENU_GAP;
          left = rect.left;
          break;
        case "bottom-right":
          top = rect.bottom + MENU_GAP;
          left = rect.right - menuWidth;
          break;
        case "top-left":
          top = rect.top - menuHeight - MENU_GAP;
          left = rect.left;
          break;
        case "top-right":
          top = rect.top - menuHeight - MENU_GAP;
          left = rect.right - menuWidth;
          break;
      }

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      left = Math.max(8, Math.min(left, viewportWidth - menuWidth - 8));
      if (top + menuHeight > viewportHeight - 8) {
        top = rect.top - menuHeight - MENU_GAP;
      }
      top = Math.max(8, top);

      setCoords({ top, left });
    };

    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen, position]);

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

  const menu =
    isOpen && mounted && coords
      ? createPortal(
          <div
            ref={menuRef}
            className="rounded-lg py-1"
            style={{
              position: "fixed",
              top: coords.top,
              left: coords.left,
              minWidth: MENU_WIDTH,
              zIndex: 9999,
              background: "var(--ifn-surface)",
              border: "1px solid var(--ifn-border)",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.25)",
              color: "var(--ifn-ink)",
            }}
          >
            {items.map((item, index) => (
              <button
                key={index}
                onClick={() => handleItemClick(item)}
                disabled={item.disabled}
                className={`ifn-popup-item w-full text-left px-3 py-2 text-sm flex items-center space-x-2 transition-colors ${
                  item.disabled ? "cursor-not-allowed" : ""
                } ${item.className || ""}`}
                style={{
                  background: "transparent",
                  border: 0,
                  color: item.disabled ? "var(--ifn-muted)" : "var(--ifn-ink)",
                  cursor: item.disabled ? "not-allowed" : "pointer",
                }}
              >
                {item.icon && (
                  <span className="flex-shrink-0">{item.icon}</span>
                )}
                <span>{item.label}</span>
              </button>
            ))}
          </div>,
          document.body
        )
      : null;

  return (
    <div className={`relative ${className}`}>
      <div
        ref={triggerRef}
        onClick={handleTriggerClick}
        className="cursor-pointer"
      >
        {trigger}
      </div>
      {menu}
    </div>
  );
};

export default PopupMenu;
