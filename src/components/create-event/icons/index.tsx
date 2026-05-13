export type CreateEventIconProps = { color?: string };

export const HostIcon = ({
  color = "var(--ifn-primary)",
}: CreateEventIconProps) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8" r="3.5" stroke={color} strokeWidth="1.6" />
    <path
      d="M4.5 20c1.5-4 4-6 7.5-6s6 2 7.5 6"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);
