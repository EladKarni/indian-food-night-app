"use client";

const VenmoIcon = ({ color = "#fff" }: { color?: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={color}>
    <path d="M18.6 3.2c.6 1 .9 2.1.9 3.5 0 4.4-3.8 10-6.9 13.7H6.1L3.5 4.7l5.8-.6 1.4 11c1.3-2.1 2.9-5.3 2.9-7.5 0-1.2-.2-2.1-.6-2.8l5.6-1.6z" />
  </svg>
);

interface VenmoPayCardProps {
  amount: number;
  hostName?: string | null;
  hostVenmoUsername: string;
  memo?: string;
}

export default function VenmoPayCard({
  amount,
  hostName,
  hostVenmoUsername,
  memo,
}: VenmoPayCardProps) {
  const handle = hostVenmoUsername.trim().replace(/^@/, "");
  const noteText = memo ?? "Indian Food Night";
  const amountStr = amount.toFixed(2);
  const venmoUrl = `https://venmo.com/${handle}?txn=pay&amount=${amountStr}&note=${encodeURIComponent(
    noteText
  )}`;
  const displayName = hostName?.trim() || "the host";

  return (
    <div
      style={{
        marginTop: 18,
        padding: 18,
        borderRadius: 18,
        background: "linear-gradient(135deg, #3D95CE 0%, #008CFF 100%)",
        color: "#fff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          right: -10,
          bottom: -28,
          fontFamily: "var(--ifn-display)",
          fontSize: 160,
          color: "rgba(255,255,255,0.08)",
          lineHeight: 1,
          fontStyle: "italic",
          pointerEvents: "none",
        }}
      >
        V
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 12,
          marginBottom: 14,
          position: "relative",
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: "rgba(255,255,255,0.18)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <VenmoIcon />
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 10.5,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              opacity: 0.75,
            }}
          >
            Pay {displayName} for Food Order
          </div>
          <div
            className="ifn-num ifn-display"
            style={{ fontSize: 30, lineHeight: 1.05, marginTop: 2 }}
          >
            ${amountStr}
          </div>
          <div style={{ fontSize: 12, opacity: 0.85, marginTop: 6 }}>
            <span style={{ opacity: 0.7 }}>to</span>{" "}
            <span style={{ fontWeight: 500 }}>@{handle}</span>
          </div>
        </div>
      </div>
      <a
        href={venmoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="ifn-btn ifn-btn--full"
        style={{
          background: "#fff",
          color: "#008CFF",
          fontWeight: 600,
          position: "relative",
          textDecoration: "none",
        }}
      >
        <VenmoIcon color="#008CFF" />
        Open Venmo
      </a>
      <div
        style={{
          fontSize: 11,
          opacity: 0.7,
          marginTop: 10,
          textAlign: "center",
          position: "relative",
        }}
      >
        Memo prefilled: &ldquo;{noteText}&rdquo;
      </div>
    </div>
  );
}
