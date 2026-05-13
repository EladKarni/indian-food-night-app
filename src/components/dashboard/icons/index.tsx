export type DashboardIconProps = { color?: string };

export const UserIcon = ({ color = "currentColor" }: DashboardIconProps) => (
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

export const CopyIcon = ({ color = "currentColor" }: DashboardIconProps) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <rect x="9" y="9" width="11" height="11" rx="2" stroke={color} strokeWidth="1.6" />
    <path d="M5 15V6a2 2 0 012-2h9" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export const EditIcon = ({ color = "currentColor" }: DashboardIconProps) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path
      d="M4 20h4l10-10-4-4L4 16v4z"
      stroke={color}
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
  </svg>
);

export const TrashIcon = ({ color = "currentColor" }: DashboardIconProps) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path
      d="M4 7h16M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2M6 7l1 13a2 2 0 002 2h6a2 2 0 002-2l1-13"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ChevronIcon = ({ color = "currentColor" }: DashboardIconProps) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ transform: "rotate(180deg)" }}>
    <path
      d="M15 6l-6 6 6 6"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export type DashboardIcon = (props: DashboardIconProps) => React.ReactElement;
