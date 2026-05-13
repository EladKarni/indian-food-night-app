import { ReactNode } from "react";
import { clsx } from "clsx";

interface AlertMessageProps {
  children: ReactNode;
  type?: "error" | "success" | "warning" | "info";
  className?: string;
}

const AlertMessage = ({ 
  children, 
  type = "info",
  className = ""
}: AlertMessageProps) => {
  const typeClasses = {
    error: "bg-red-100 border-red-400 text-red-700",
    success: "bg-green-100 border-green-400 text-green-700", 
    warning: "bg-yellow-100 border-yellow-400 text-yellow-700",
    info: "bg-blue-100 border-blue-400 text-blue-700"
  };

  return (
    <div className={clsx(
      "px-4 py-3 rounded-lg text-sm border",
      typeClasses[type],
      className
    )}>
      <span>{children}</span>
    </div>
  );
};

export default AlertMessage;