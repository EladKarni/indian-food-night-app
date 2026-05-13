"use client";

import { useTheme } from "@/contexts/ThemeContext";

const SunIcon = ({ color = "currentColor" }: { color?: string }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="4" stroke={color} strokeWidth="1.6" />
    <path
      d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

const MoonIcon = ({ color = "currentColor" }: { color?: string }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path
      d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z"
      stroke={color}
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
  </svg>
);

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`ifn-topbar-btn ${className}`}
      style={{ cursor: "pointer" }}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      {isDark ? (
        <SunIcon color="var(--ifn-ink-2)" />
      ) : (
        <MoonIcon color="var(--ifn-ink-2)" />
      )}
    </button>
  );
}
