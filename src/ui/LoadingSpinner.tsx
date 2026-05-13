import { clsx } from "clsx";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

const LoadingSpinner = ({ 
  size = "md", 
  text,
  className = ""
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6", 
    lg: "h-8 w-8"
  };

  const spinner = (
    <div className={clsx(
      "animate-spin rounded-full border-b-2 border-current",
      sizeClasses[size]
    )} />
  );

  if (text) {
    return (
      <div className={clsx("flex items-center space-x-2", className)}>
        {spinner}
        <span>{text}</span>
      </div>
    );
  }

  return <div className={className}>{spinner}</div>;
};

export default LoadingSpinner;