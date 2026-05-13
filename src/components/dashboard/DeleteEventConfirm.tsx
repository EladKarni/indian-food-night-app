"use client";

interface DeleteEventConfirmProps {
  loading: boolean;
  error: string | null;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function DeleteEventConfirm({
  loading,
  error,
  onCancel,
  onConfirm,
}: DeleteEventConfirmProps) {
  return (
    <div
      className="ifn-card"
      style={{ marginTop: 14, padding: 14, borderColor: "var(--ifn-chili)" }}
    >
      <div
        style={{ fontSize: 13, color: "var(--ifn-ink-2)", marginBottom: 10 }}
      >
        Delete this event for everyone? This can&apos;t be undone.
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button
          type="button"
          onClick={onCancel}
          className="ifn-btn ifn-btn--ghost"
          style={{ flex: 1 }}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={loading}
          className="ifn-btn ifn-btn--primary"
          style={{ flex: 1, background: "var(--ifn-chili)" }}
        >
          {loading ? "Deleting…" : "Delete"}
        </button>
      </div>
      {error && (
        <div
          style={{ fontSize: 12, color: "var(--ifn-chili)", marginTop: 8 }}
          role="alert"
        >
          {error}
        </div>
      )}
    </div>
  );
}
