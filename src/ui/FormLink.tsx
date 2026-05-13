import Link from "next/link";
import { ReactNode } from "react";
import { clsx } from "clsx";

interface FormLinkProps {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
}

const FormLink = ({ 
  href, 
  children, 
  variant = "primary",
  className = ""
}: FormLinkProps) => {
  const variantClasses = {
    primary: "text-slate-800 font-semibold hover:text-slate-900",
    secondary: "text-slate-600 hover:text-slate-800"
  };

  return (
    <Link
      href={href}
      className={clsx(
        "text-sm transition-colors",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </Link>
  );
};

export default FormLink;