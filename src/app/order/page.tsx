"use client";

import { Suspense } from "react";
import EventInfoOrderStrip from "@/components/EventInfoOrderStrip";
import OrderItem from "@/components/OrderItem";
import OrderList from "@/components/OrderList";
import PageSuspenseFallback from "@/components/PageSuspenseFallback";
import { CutoffWarningBanner } from "@/components/CutoffWarningBanner";
import { useOrders } from "@/hooks/useOrders";
import { useActiveEvent } from "@/hooks/useActiveEvent";
import { useAuth } from "@/contexts/AuthContext";
import { useGuestName } from "@/hooks/useGuestName";
import { useHostProfile } from "@/hooks/useHostProfile";
import { useFinalizeOrders } from "@/hooks/useFinalizeOrders";
import { calculateCutoffStatus, formatCutoffTime } from "@/util/cutoffUtil";
import OrderPageTopbar from "./OrderPageTopbar";
import FinalizeOrderButton from "./FinalizeOrderButton";

const DEFAULT_RESTAURANT = "Coriander Indian Grill";

function OrderPageContent() {
  const { activeEvent } = useActiveEvent();
  const { orders, loading, error, refetch, updateOrder } = useOrders(
    activeEvent?.id
  );
  const { user } = useAuth();
  const { guestName } = useGuestName();
  const { hostProfile } = useHostProfile(activeEvent?.host_id ?? undefined);

  const cutoffStatus = calculateCutoffStatus(activeEvent);
  const currentUserName =
    user?.user_metadata?.full_name || user?.email || guestName;
  const userOrders = orders.filter(
    (order) => order.user_name === currentUserName
  );

  const { finalize, finalizing, allOrdersSubmitted } = useFinalizeOrders({
    userOrders,
    updateOrder,
    onComplete: () => {
      window.location.href = "/order-overview";
    },
  });

  const restaurant = activeEvent?.restaurant || DEFAULT_RESTAURANT;

  function renderCutoffBanner() {
    if (!cutoffStatus?.isPastCutoff || !cutoffStatus.cutoffDateTime) {
      return null;
    }
    return (
      <CutoffWarningBanner
        hostName={hostProfile?.full_name || hostProfile?.email || "the host"}
        cutoffTime={formatCutoffTime(cutoffStatus.cutoffDateTime)}
      />
    );
  }

  function renderFinalizeArea() {
    if (loading) {
      return (
        <div style={{ marginTop: 16 }}>
          <div className="ifn-skel" style={{ height: 48, borderRadius: 14 }} />
        </div>
      );
    }
    if (userOrders.length === 0) return null;
    return (
      <FinalizeOrderButton
        finalizing={finalizing}
        allOrdersSubmitted={allOrdersSubmitted}
        onClick={finalize}
      />
    );
  }

  return (
    <main className="ifn-screen ifn-app">
      <div className="ifn-page-shell">
        <OrderPageTopbar restaurant={restaurant} />

        <div className="ifn-screen-pad" style={{ paddingTop: 4 }}>
          <EventInfoOrderStrip />
          {renderCutoffBanner()}
          <OrderItem onOrderAdded={refetch} />
          <OrderList orders={orders} loading={loading} error={error} />
          {renderFinalizeArea()}
        </div>
      </div>
    </main>
  );
}

export default function OrderPage() {
  return (
    <Suspense fallback={<PageSuspenseFallback />}>
      <OrderPageContent />
    </Suspense>
  );
}
