import { ReactNode } from "react";
import { clsx } from "clsx";

interface PageContainerProps {
  children: ReactNode;
  variant?: "default" | "gradient" | "dashboard";
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  className?: string;
}

const PageContainer = ({ 
  children, 
  variant = "default",
  maxWidth = "2xl",
  className = "" 
}: PageContainerProps) => {
  const variantClasses = {
    default: "min-h-screen p-6",
    gradient: "min-h-screen bg-gradient-to-br from-orange-200 via-rose-300 to-slate-500 flex items-center justify-center p-4",
    dashboard: "min-h-screen p-6 bg-base-100"
  };

  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md", 
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    full: "max-w-full"
  };

  const containerClass = variant === "gradient" ? "" : `${maxWidthClasses[maxWidth]} mx-auto`;

  return (
    <main className={clsx(variantClasses[variant], className)}>
      <div className={containerClass}>
        {children}
      </div>
    </main>
  );
};

export default PageContainer;