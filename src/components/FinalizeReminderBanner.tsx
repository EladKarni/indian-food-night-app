export function FinalizeReminderBanner() {
  return (
    <div
      className="bg-blue-50 border-l-4 border-blue-500 text-blue-900 p-3 rounded-lg shadow-sm"
      style={{ margin: "8px 0" }}
    >
      <div className="flex items-start">
        <span className="text-xl mr-3" aria-hidden>
          ℹ️
        </span>
        <div>
          <p className="font-semibold mb-1">
            Don&apos;t forget to finalize your order
          </p>
          <p className="text-sm">
            Tap <strong>Finalize my order</strong> at the bottom of the page —
            items aren&apos;t sent to the host until you do.
          </p>
        </div>
      </div>
    </div>
  );
}
