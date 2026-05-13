"use client";

import { Suspense } from "react";
import { useRouter } from "next/navigation";
import Button from "@/ui/button";
import UserInfo from "@/components/EventInfo";
import OrderList from "@/components/OrderList";
import { useAuth } from "@/contexts/AuthContext";
import { useActiveEvent } from "@/hooks/useActiveEvent";
import Link from "next/link";

function OrderOverviewPageContent() {
  const router = useRouter();
  const { user } = useAuth();
  const { activeEvent, loading: eventLoading } = useActiveEvent();

  // Check if current user is the host
  const isHost = user && activeEvent && activeEvent.host_id === user.id;

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-200 via-rose-300 to-slate-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto bg-gradient-to-b from-orange-300 to-orange-200 rounded-3xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-orange-400 p-4 flex items-center relative">
          {eventLoading ? (
            <div className="flex-1 flex justify-center">
              <div className="skeleton h-6 w-40 bg-slate-300/60" />
            </div>
          ) : (
            <h1 className="text-lg font-semibold text-slate-700 flex-1 text-center">
              {isHost ? "Event Overview" : "Order Completed"}
            </h1>
          )}
        </div>

        <div className="p-6 space-y-6">
          {/* User Info */}
          <div className="mb-6">
            <UserInfo showProfilePicture={false} className="mb-4" />
            {eventLoading ? (
              <div className="skeleton h-4 w-3/4 bg-slate-300/60 mt-1" />
            ) : (
              <p className="text-slate-600 text-sm italic">
                {isHost
                  ? "Here's the overview of all orders for your event."
                  : "You're all set for IFN. Feel free to text the host if you have any questions."}
              </p>
            )}
          </div>

          {/* Order List */}
          <div className="mb-8">
            <OrderList showAllOrders={isHost || false} isOverviewPage={true} isHostView={isHost || false} />
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {/* Order Mode Button - Only for hosts. Reserve space while loading so host button doesn't pop in. */}
            {eventLoading ? (
              <div className="skeleton h-12 w-full rounded-2xl bg-slate-300/60" />
            ) : isHost ? (
              <Link
                href="/order-mode"
                className="flex bg-green-600 hover:bg-green-700 w-full text-center text-white btn font-medium rounded-2xl transition-colors duration-200 border-none focus:outline-none focus:ring-2 focus:ring-offset-2"
              >
                📞 Enter Order Mode
              </Link>
            ) : null}

            <Button
              fullWidth={true}
              variant="primary"
              onClick={() => router.push("/order")}
              className="bg-blue-500 hover:bg-blue-600"
            >
              Back to Order Page
            </Button>
            <Button
              fullWidth={true}
              variant="secondary"
              onClick={() => router.push("/dashboard")}
              className="bg-orange-500 hover:bg-orange-600"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function OrderOverviewPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-gradient-to-br from-orange-200 via-rose-300 to-slate-500 flex items-center justify-center p-4">
          <div className="w-full max-w-md mx-auto bg-gradient-to-b from-orange-300 to-orange-200 rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-6 text-center">
              <div className="loading loading-spinner loading-md mb-4"></div>
              <p className="text-slate-700">Loading...</p>
            </div>
          </div>
        </main>
      }
    >
      <OrderOverviewPageContent />
    </Suspense>
  );
}
