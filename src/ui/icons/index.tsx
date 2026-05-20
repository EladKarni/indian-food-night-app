export type AppIconProps = {
  color?: string;
  size?: number;
};

export const BackIcon = ({
  color = "var(--ifn-ink-2)",
  size = 20,
}: AppIconProps = {}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M15 6l-6 6 6 6"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const MoreIcon = ({
  color = "var(--ifn-ink-2)",
  size = 20,
}: AppIconProps = {}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="5" cy="12" r="1.4" fill={color} />
    <circle cx="12" cy="12" r="1.4" fill={color} />
    <circle cx="19" cy="12" r="1.4" fill={color} />
  </svg>
);

export const CheckIcon = ({
  color = "var(--ifn-primary)",
  size = 20,
}: AppIconProps = {}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M5 12.5l4.5 4.5L19 7"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const AppPhoneIcon = ({
  color = "#fff",
  size = 18,
}: AppIconProps = {}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M5 5.5C5 4.7 5.7 4 6.5 4h2c.8 0 1.5.7 1.5 1.5 0 1.3.2 2.5.6 3.6.2.5 0 1.1-.4 1.5l-1.4 1.4a14 14 0 006.3 6.3l1.4-1.4c.4-.4 1-.6 1.5-.4 1.1.4 2.3.6 3.6.6.8 0 1.5.7 1.5 1.5v2c0 .8-.7 1.5-1.5 1.5C11.5 22 2 12.5 2 6.5 2 5.7 2.7 5 3.5 5H5"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const PlusIcon = ({
  color = "currentColor",
  size = 18,
}: AppIconProps = {}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M12 5v14M5 12h14"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export const MinusIcon = ({
  color = "var(--ifn-ink-2)",
  size = 18,
}: AppIconProps = {}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M5 12h14"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export const PencilIcon = ({
  color = "var(--ifn-ink-2)",
  size = 16,
}: AppIconProps = {}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M4 20h4l10.5-10.5a2.121 2.121 0 0 0-3-3L5 17v3z"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13.5 6.5l3 3"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

export const TrashIcon = ({
  color = "var(--ifn-chili)",
  size = 16,
}: AppIconProps = {}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 11v7M14 11v7"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

export const SearchIcon = ({
  color = "var(--ifn-muted)",
  size = 18,
}: AppIconProps = {}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="11" cy="11" r="6.5" stroke={color} strokeWidth="1.6" />
    <path d="M16 16l4 4" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export const CalendarIcon = ({
  color = "currentColor",
  size = 14,
}: AppIconProps = {}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect
      x="3.5"
      y="5"
      width="17"
      height="15"
      rx="2.5"
      stroke={color}
      strokeWidth="1.6"
    />
    <path
      d="M3.5 10h17M8 3v4M16 3v4"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

export const ClockIcon = ({
  color = "currentColor",
  size = 14,
}: AppIconProps = {}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="8.5" stroke={color} strokeWidth="1.6" />
    <path
      d="M12 7.5V12l3 2"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);
