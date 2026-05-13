"use client";

import { Suspense } from "react";
import EventInfoCard from "@/components/EventInfoCard";
import OrderList from "@/components/OrderList";
import VenmoCollectionStrip from "@/components/orders/VenmoCollectionStrip";
import PageSuspenseFallback from "@/components/PageSuspenseFallback";
import { useAuth } from "@/contexts/AuthContext";
import { useActiveEvent } from "@/hooks/useActiveEvent";
import { useOrders } from "@/hooks/useOrders";
import { useHostProfile } from "@/hooks/useHostProfile";
import { formatEventLabel } from "@/util/dateUtils";
import { sumOrderPrices } from "@/util/orderGrouping";
import OrderOverviewTopbar from "./OrderOverviewTopbar";
import HostRunningTotalCard from "./HostRunningTotalCard";
import GuestConfirmedHeader from "./GuestConfirmedHeader";
import OrderOverviewFooter from "./OrderOverviewFooter";
import GuestSetHint from "./GuestSetHint";

const TAX_MULTIPLIER = 1.07;

function OrderOverviewPageContent() {
  const { user } = useAuth();
  const { activeEvent, loading: eventLoading } = useActiveEvent();
  const { orders } = useOrders(activeEvent?.id);
  const { hostProfile } = useHostProfile(activeEvent?.host_id || undefined);

  const isHost = !!user && !!activeEvent && activeEvent.host_id === user.id;

  const submittedOrders = orders.filter((o) => o.is_submitted);
  const hostRunningTotal = sumOrderPrices(submittedOrders);
  const submittedUserCount = new Set(submittedOrders.map((o) => o.user_name))
    .size;
  const totalUserCount = new Set(orders.map((o) => o.user_name)).size;

  const pendingTotal = hostRunningTotal * TAX_MULTIPLIER;
  const showVenmoStrip =
    isHost && !!hostProfile?.venmo_username && pendingTotal > 0;

  const eventLabel = formatEventLabel(
    activeEvent?.event_date,
    activeEvent?.start_time
  );

  function renderHeader() {
    if (isHost) {
      return (
        <HostRunningTotalCard
          submittedCount={submittedUserCount}
          totalCount={totalUserCount}
          runningTotal={hostRunningTotal}
        />
      );
    }
    return <GuestConfirmedHeader eventLabel={eventLabel} />;
  }

  function renderGuestExtras() {
    if (isHost) return null;
    return (
      <>
        <div style={{ marginBottom: 14 }}>
          <EventInfoCard />
        </div>
        {!eventLoading && <GuestSetHint />}
      </>
    );
  }

  return (
    <main className="ifn-screen ifn-app">
      <div className="ifn-page-shell">
        <OrderOverviewTopbar isHost={isHost} eventLabel={eventLabel} />

        <div className="ifn-screen-pad" style={{ paddingTop: 8 }}>
          {renderHeader()}

          {showVenmoStrip && (
            <VenmoCollectionStrip collected={0} pending={pendingTotal} />
          )}

          {renderGuestExtras()}

          <OrderList
            showAllOrders={isHost}
            isOverviewPage={true}
            isHostView={isHost}
          />

          <OrderOverviewFooter />
        </div>
      </div>
    </main>
  );
}

export default function OrderOverviewPage() {
  return (
    <Suspense fallback={<PageSuspenseFallback />}>
      <OrderOverviewPageContent />
    </Suspense>
  );
}
