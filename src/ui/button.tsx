import { clsx } from "clsx";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  fullWidth?: boolean;
  uppercase?: boolean;
  lowercase?: boolean;
  capitalize?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  className?: string;
}

const Button = ({
  children,
  onClick,
  type = "button",
  disabled = false,
  fullWidth = false,
  uppercase = false,
  lowercase = false,
  capitalize = false,
  size = "md",
  variant = "primary",
  className = "",
}: ButtonProps) => {
  const baseClasses =
    "btn font-medium rounded-2xl transition-colors duration-200 border-none focus:outline-none focus:ring-2 focus:ring-offset-2";

  const sizeClasses = {
    sm: "py-2 px-4 text-xs",
    md: "py-3 px-6 text-sm",
    lg: "py-4 px-8 text-base",
    xl: "py-5 px-10 text-lg",
  };

  const variantClasses = {
    primary:
      "bg-orange-500 hover:bg-orange-600 text-white focus:ring-orange-400",
    secondary:
      "bg-slate-500 hover:bg-slate-600 text-white focus:ring-slate-400",
    outline:
      "bg-transparent border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white focus:ring-orange-400",
    ghost:
      "bg-transparent text-orange-500 hover:bg-orange-50 focus:ring-orange-400",
    danger: "bg-red-500 hover:bg-red-600 text-white focus:ring-red-400",
  };

  const textTransformClasses = {
    uppercase: uppercase ? "uppercase" : "",
    lowercase: lowercase ? "lowercase" : "",
    capitalize: capitalize ? "capitalize" : "",
  };

  const widthClasses = fullWidth ? "w-full" : "w-auto";

  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      className={clsx(
        baseClasses,
        sizeClasses[size],
        variantClasses[variant],
        textTransformClasses.uppercase,
        textTransformClasses.lowercase,
        textTransformClasses.capitalize,
        widthClasses,
        disabledClasses,
        className
      )}
    >
      {children}
    </button>
  );
};

export default Button;
