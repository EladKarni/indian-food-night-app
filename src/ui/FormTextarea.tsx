import { forwardRef } from "react";
import { clsx } from "clsx";

interface FormTextareaProps {
  id?: string;
  name?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  autoCapitalize?: "none" | "words" | "sentences" | "characters";
  spellCheck?: boolean;
  rows?: number;
  resize?: "none" | "vertical" | "horizontal" | "both";
  variant?: "default" | "daisyui";
  className?: string;
}

const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(({
  id,
  name,
  placeholder,
  value,
  onChange,
  onFocus,
  onBlur,
  required = false,
  disabled = false,
  readOnly = false,
  autoCapitalize,
  spellCheck,
  rows = 4,
  resize = "none",
  variant = "default",
  className = "",
}, ref) => {
  const variantClasses = {
    default: "w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none",
    daisyui: "textarea textarea-bordered w-full"
  };

  const resizeClasses = {
    none: "resize-none",
    vertical: "resize-y",
    horizontal: "resize-x", 
    both: "resize"
  };

  return (
    <textarea
      ref={ref}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      readOnly={readOnly}
      autoCapitalize={autoCapitalize}
      spellCheck={spellCheck}
      rows={rows}
      className={clsx(
        variantClasses[variant],
        resizeClasses[resize],
        disabled && "opacity-50 cursor-not-allowed bg-slate-100",
        readOnly && "bg-slate-100 cursor-not-allowed",
        className
      )}
    />
  );
});

FormTextarea.displayName = "FormTextarea";

export default FormTextarea;