export default function EventSectionEmpty() {
  return (
    <div className="ifn-card" style={{ padding: 18, textAlign: "center" }}>
      <div className="ifn-eyebrow" style={{ marginBottom: 8 }}>
        The table&apos;s set down
      </div>
      <div style={{ fontSize: 14, color: "var(--ifn-muted)" }}>
        No upcoming events — check back soon.
      </div>
    </div>
  );
}
