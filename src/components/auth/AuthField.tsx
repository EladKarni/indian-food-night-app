"use client";

import { ReactNode } from "react";

interface AuthFieldProps {
  icon: ReactNode;
  placeholder: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  name?: string;
  autoComplete?: string;
  required?: boolean;
  minLength?: number;
}

export default function AuthField({
  icon,
  placeholder,
  type = "text",
  value,
  onChange,
  name,
  autoComplete,
  required,
  minLength,
}: AuthFieldProps) {
  return (
    <div style={{ position: "relative" }}>
      <span
        style={{
          position: "absolute",
          left: 14,
          top: "50%",
          transform: "translateY(-50%)",
          color: "var(--ifn-muted)",
          display: "inline-flex",
        }}
      >
        {icon}
      </span>
      <input
        className="ifn-input"
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        name={name}
        autoComplete={autoComplete}
        required={required}
        minLength={minLength}
        style={{
          paddingLeft: 40,
          paddingTop: 14,
          paddingBottom: 14,
          fontSize: 14.5,
        }}
      />
    </div>
  );
}
