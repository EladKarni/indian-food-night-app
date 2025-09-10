"use client";

import { Suspense } from "react";
import Link from "next/link";
import IFNInfo from "@/components/IFNInfo";
import OrderItem from "@/components/OrderItem";
import OrderList from "@/components/OrderList";
import { useOrders } from "@/hooks/useOrders";
import { useActiveEvent } from "@/hooks/useActiveEvent";
import { useAuth } from "@/contexts/AuthContext";
import { useGuestName } from "@/hooks/useGuestName";
import Button from "@/ui/button";

function OrderPageContent() {
  const { activeEvent } = useActiveEvent();
  const { orders, loading, error, refetch } = useOrders(activeEvent?.id);
  const { user } = useAuth();
  const { guestName } = useGuestName();

  // Get current user's orders to check count
  const currentUserName =
    user?.user_metadata?.full_name || user?.email || guestName;
  const userOrders = orders.filter(
    (order) => order.user_name === currentUserName
  );
  const hasMultipleOrders = userOrders.length > 1;

  return (
    <main className="flex items-center justify-center p-4 min-h-[calc(100vh-80px)]">
      <div className="w-full max-w-md mx-auto bg-gradient-to-b from-orange-300 to-orange-200 rounded-3xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-orange-400 text-center py-3 px-4 relative">
          <h1 className="text-xs font-medium text-slate-700 leading-tight">
            Ordering From: Coriander India Grill
          </h1>
        </div>

        <div className="p-6 space-y-6">
          {/* User Info */}
          <IFNInfo className="mb-8" />

          {/* Order Section */}
          <div>
            <OrderItem onOrderAdded={refetch} />
          </div>

          {/* Order List */}
          <div>
            <OrderList orders={orders} loading={loading} error={error} />
          </div>

          {/* Submit Order Button - Show when user has orders */}
          {userOrders.length > 0 && (
            <div className="pt-4 border-t border-slate-400/20 space-y-3">
              <Button
                fullWidth={true}
                variant="primary"
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => {
                  // For now, navigate to overview page
                  // In the future, this could handle order submission
                  window.location.href = "/order-overview";
                }}
              >
                Submit Order
              </Button>

              {/* Overview Button - Only show if user has more than one order
              {hasMultipleOrders && (
                <Link href="/order-overview">
                  <Button
                    fullWidth={true}
                    variant="secondary"
                    className="bg-slate-600 hover:bg-slate-700 text-white"
                  >
                    View Order Overview
                  </Button>
                </Link>
              )} */}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function OrderPage() {
  return (
    <Suspense
      fallback={
        <main className="flex items-center justify-center p-4 min-h-[calc(100vh-80px)]">
          <div className="w-full max-w-md mx-auto bg-gradient-to-b from-orange-300 to-orange-200 rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-6 text-center">
              <div className="loading loading-spinner loading-md mb-4"></div>
              <p className="text-slate-700">Loading...</p>
            </div>
          </div>
        </main>
      }
    >
      <OrderPageContent />
    </Suspense>
  );
}
