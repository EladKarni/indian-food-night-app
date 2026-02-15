import React from "react";

interface IconButtonProps {
  icon: React.ReactNode;
  onClick: () => void;
  className?: string;
  ariaLabel?: string;
  title?: string;
}

export default function IconButton({
  icon,
  onClick,
  className = "",
  ariaLabel,
  title,
}: IconButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full flex items-center justify-center transition-colors ${className}`}
      aria-label={ariaLabel}
      title={title}
    >
      {icon}
    </button>
  );
}
