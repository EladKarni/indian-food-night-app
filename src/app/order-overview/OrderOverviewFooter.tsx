"use client";

import { useRouter } from "next/navigation";

export default function OrderOverviewFooter() {
  const router = useRouter();

  return (
    <div className="ifn-stack" style={{ marginTop: 20 }}>
      <button
        type="button"
        className="ifn-btn ifn-btn--ghost ifn-btn--full"
        onClick={() => router.push("/order")}
      >
        Back to order
      </button>
      <button
        type="button"
        className="ifn-btn ifn-btn--soft ifn-btn--full"
        onClick={() => router.push("/dashboard")}
      >
        Back to dashboard
      </button>
    </div>
  );
}
