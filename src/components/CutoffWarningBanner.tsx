interface CutoffWarningBannerProps {
  hostName: string;
  cutoffTime: string;
}

export function CutoffWarningBanner({
  hostName,
  cutoffTime,
}: CutoffWarningBannerProps) {
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-900 p-4 rounded-lg shadow-sm">
      <div className="flex items-start">
        <span className="text-2xl mr-3">⚠️</span>
        <div>
          <p className="font-semibold mb-1">Orders Closed at {cutoffTime}</p>
          <p className="text-sm">
            The ordering window has passed. Please reach out to {hostName}{" "}
            directly if you still need to place an order.
          </p>
        </div>
      </div>
    </div>
  );
}
