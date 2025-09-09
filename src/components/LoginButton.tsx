"use client";

import Button from "@/ui/button";

interface LoginButtonProps {
  position?: "fixed" | "static";
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

const LoginButton = ({
  variant = "secondary",
  size = "sm",
  className = "",
  children,
  onClick,
}: LoginButtonProps) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      window.location.href = "/login";
    }
  };

  return (
    <div className={`${className}`}>
      <Button
        fullWidth={false}
        variant={variant}
        size={size}
        onClick={handleClick}
        className="shadow-lg"
      >
        {children}
      </Button>
    </div>
  );
};

export default LoginButton;
