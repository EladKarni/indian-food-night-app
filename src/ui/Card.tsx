import { ReactNode } from "react";
import { clsx } from "clsx";

interface CardProps {
  children: ReactNode;
  variant?: "default" | "daisyui" | "auth";
  className?: string;
}

const Card = ({ children, variant = "default", className = "" }: CardProps) => {
  const variantClasses = {
    default: "bg-white rounded-lg shadow-md p-6",
    daisyui: "card bg-base-200 shadow-xl",
    auth: "w-full max-w-lg mx-auto bg-gradient-to-b from-orange-300 to-orange-200 rounded-3xl overflow-hidden shadow-2xl"
  };

  return (
    <div className={clsx(variantClasses[variant], className)}>
      {children}
    </div>
  );
};

export default Card;