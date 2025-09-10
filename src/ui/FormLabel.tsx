import { ReactNode } from "react";
import { clsx } from "clsx";

interface FormLabelProps {
  htmlFor?: string;
  children: ReactNode;
  required?: boolean;
  variant?: "default" | "daisyui";
  className?: string;
}

const FormLabel = ({
  htmlFor,
  children,
  required = false,
  variant = "default",
  className = "",
}: FormLabelProps) => {
  const variantClasses = {
    default: "block text-sm font-medium text-slate-700 mb-2",
    daisyui: "label-text font-medium"
  };

  const labelElement = (
    <span className={clsx(variantClasses[variant], className)}>
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </span>
  );

  if (variant === "daisyui") {
    return (
      <label className="label" htmlFor={htmlFor}>
        {labelElement}
      </label>
    );
  }

  return (
    <label htmlFor={htmlFor}>
      {labelElement}
    </label>
  );
};

export default FormLabel;