import Link from "next/link";

const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path
      d="M15 6l-6 6 6 6"
      stroke="var(--ifn-ink-2)"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function CreateEventTopbar() {
  return (
    <div className="ifn-topbar">
      <Link
        href="/dashboard"
        className="ifn-topbar-btn"
        style={{ textDecoration: "none" }}
        aria-label="Back to dashboard"
      >
        <BackIcon />
      </Link>
      <div style={{ textAlign: "center", flex: 1 }}>
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: "-0.01em",
          }}
        >
          New Event
        </div>
      </div>
      <span style={{ width: 38, height: 38 }} />
    </div>
  );
}
