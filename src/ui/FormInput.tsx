import { ReactNode, forwardRef } from "react";
import { clsx } from "clsx";

interface FormInputProps {
  id?: string;
  name?: string;
  type?: "text" | "email" | "password" | "tel" | "date" | "time";
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  autoComplete?: string;
  autoCapitalize?: "none" | "words" | "sentences" | "characters";
  spellCheck?: boolean;
  minLength?: number;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  variant?: "default" | "auth" | "daisyui";
  className?: string;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      id,
      name,
      type = "text",
      placeholder,
      value,
      onChange,
      onFocus,
      onBlur,
      onKeyDown,
      required = false,
      disabled = false,
      readOnly = false,
      autoComplete,
      autoCapitalize,
      spellCheck,
      minLength,
      leftIcon,
      rightIcon,
      variant = "default",
      className = "",
    },
    ref
  ) => {
    const variantClasses = {
      default:
        "w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none",
      auth: "w-full pl-4 pr-12 py-3 bg-white/70 border-2 border-dashed border-slate-400 rounded-2xl placeholder-slate-500 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white focus:border-solid",
      daisyui: "input input-bordered w-full",
    };

    const inputElement = (
      <input
        ref={ref}
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        readOnly={readOnly}
        autoComplete={autoComplete}
        autoCapitalize={autoCapitalize}
        spellCheck={spellCheck}
        minLength={minLength}
        className={clsx(
          variantClasses[variant],
          disabled && "opacity-50 cursor-not-allowed bg-slate-100",
          readOnly && "bg-slate-100 cursor-not-allowed",
          leftIcon && variant === "auth" && "pl-12",
          className
        )}
      />
    );

    if (leftIcon || rightIcon) {
      return (
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              {leftIcon}
            </div>
          )}
          {leftIcon && <div className="ml-12">{inputElement}</div>}
          {rightIcon && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              {rightIcon}
            </div>
          )}
        </div>
      );
    }

    return inputElement;
  }
);

FormInput.displayName = "FormInput";

export default FormInput;
