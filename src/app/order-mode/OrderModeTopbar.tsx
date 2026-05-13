"use client";

import { useRouter } from "next/navigation";
import { BackIcon } from "@/ui/icons";

export default function OrderModeTopbar() {
  const router = useRouter();

  return (
    <div className="ifn-topbar">
      <button
        type="button"
        onClick={() => router.push("/order-overview")}
        className="ifn-topbar-btn"
        style={{ cursor: "pointer" }}
      >
        <BackIcon />
      </button>
      <div className="ifn-topbar-title-block">
        <div className="ifn-topbar-eyebrow">On the phone</div>
        <div className="ifn-topbar-title">Order script</div>
      </div>
      <span className="ifn-topbar-spacer" />
    </div>
  );
}
