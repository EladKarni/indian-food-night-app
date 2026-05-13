"use client";

import { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useActiveEvent } from "@/hooks/useActiveEvent";
import { useOrders } from "@/hooks/useOrders";
import { useGroupedSubmittedOrders } from "@/hooks/useGroupedSubmittedOrders";
import ProtectedRoute from "@/components/ProtectedRoute";
import PageSuspenseFallback from "@/components/PageSuspenseFallback";
import OrderModeTopbar from "./OrderModeTopbar";
import RestaurantCallout from "./RestaurantCallout";
import GroupedOrderRow from "./GroupedOrderRow";
import OrderModeTotals from "./OrderModeTotals";
import OrderModeFooter from "./OrderModeFooter";
import LargePartyHint from "./LargePartyHint";

const DEFAULT_RESTAURANT = "Coriander Grill";
const RESTAURANT_PHONE = "(415) 555-0142";
const LARGE_PARTY_THRESHOLD = 2;

function OrderModePageContent() {
  const router = useRouter();
  const { user } = useAuth();
  const { activeEvent } = useActiveEvent();
  const { orders, loading, error } = useOrders(activeEvent?.id);
  const { groupedOrders, submittedOrders, uniqueUsers, subtotal, tax, total } =
    useGroupedSubmittedOrders(orders);

  const isHost = !!user && !!activeEvent && activeEvent.host_id === user.id;

  useEffect(() => {
    if (!isHost && activeEvent) {
      router.push("/order-overview");
    }
  }, [isHost, activeEvent, router]);

  if (!isHost) {
    return null;
  }

  const restaurant = activeEvent?.restaurant || DEFAULT_RESTAURANT;
  const showLargePartyHint = uniqueUsers > LARGE_PARTY_THRESHOLD;

  function renderOrdersList() {
    if (groupedOrders.length === 0) {
      return (
        <div className="ifn-empty ifn-empty--lg">No submitted orders yet.</div>
      );
    }
    return (
      <>
        {groupedOrders.map((group) => (
          <GroupedOrderRow key={group.item_name} group={group} />
        ))}
        <OrderModeTotals
          itemCount={submittedOrders.length}
          subtotal={subtotal}
          tax={tax}
          total={total}
        />
      </>
    );
  }

  function renderBody() {
    if (loading) {
      return <div className="ifn-empty ifn-empty--lg">Loading orders…</div>;
    }
    if (error) {
      return <div className="ifn-empty ifn-empty--error">{error}</div>;
    }
    return (
      <>
        <RestaurantCallout restaurant={restaurant} phone={RESTAURANT_PHONE} />
        {showLargePartyHint && <LargePartyHint uniqueUsers={uniqueUsers} />}
        {renderOrdersList()}
        <OrderModeFooter />
      </>
    );
  }

  return (
    <main className="ifn-screen ifn-app">
      <div className="ifn-page-shell">
        <OrderModeTopbar />
        <div className="ifn-screen-pad" style={{ paddingTop: 4 }}>
          {renderBody()}
        </div>
      </div>
    </main>
  );
}

export default function OrderModePage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<PageSuspenseFallback />}>
        <OrderModePageContent />
      </Suspense>
    </ProtectedRoute>
  );
}
