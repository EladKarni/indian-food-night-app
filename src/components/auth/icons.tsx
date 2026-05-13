type IconProps = { color?: string };

export const MailIcon = ({ color = "currentColor" }: IconProps) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <rect x="3.5" y="5" width="17" height="14" rx="2.5" stroke={color} strokeWidth="1.6" />
    <path
      d="M4 7l8 6 8-6"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const LockIcon = ({ color = "currentColor" }: IconProps) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <rect x="4.5" y="10" width="15" height="10" rx="2.5" stroke={color} strokeWidth="1.6" />
    <path d="M8 10V7a4 4 0 018 0v3" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export const UserIcon = ({ color = "currentColor" }: IconProps) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8" r="3.5" stroke={color} strokeWidth="1.6" />
    <path
      d="M4.5 20c1.5-4 4-6 7.5-6s6 2 7.5 6"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

export const PinIcon = ({ color = "currentColor" }: IconProps) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 22s7-7.5 7-13a7 7 0 10-14 0c0 5.5 7 13 7 13z"
      stroke={color}
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="9" r="2.5" stroke={color} strokeWidth="1.6" />
  </svg>
);

export const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path
      d="M22.5 12.27c0-.79-.07-1.55-.2-2.27H12v4.3h5.92a5.06 5.06 0 01-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.11z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.98.66-2.24 1.05-3.72 1.05-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0012 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.1A6.6 6.6 0 015.5 12c0-.73.12-1.44.34-2.1V7.07H2.18a11 11 0 000 9.87l3.66-2.84z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.2 1.64l3.15-3.15A11 11 0 0012 1a11 11 0 00-9.82 6.07L5.84 9.9C6.71 7.31 9.14 5.38 12 5.38z"
      fill="#EA4335"
    />
  </svg>
);

export const BackIcon = ({ color = "currentColor" }: IconProps) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path
      d="M15 6l-6 6 6 6"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
