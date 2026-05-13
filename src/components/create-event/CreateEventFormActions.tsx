"use client";

import Link from "next/link";

interface CreateEventFormActionsProps {
  submitting: boolean;
}

export default function CreateEventFormActions({
  submitting,
}: CreateEventFormActionsProps) {
  return (
    <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
      <Link
        href="/dashboard"
        className="ifn-btn ifn-btn--ghost"
        style={{ flex: 1, textDecoration: "none" }}
      >
        Cancel
      </Link>
      <button
        type="submit"
        className="ifn-btn ifn-btn--primary"
        style={{ flex: 2 }}
        disabled={submitting}
      >
        {submitting ? "Creating…" : "Create event"}
      </button>
    </div>
  );
}
