import Link from "next/link";

export default function OverviewButton() {
  return (
    <Link
      href="/order-overview"
      className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-2xl transition-colors text-sm"
    >
      📋 View Order Overview
    </Link>
  );
}
