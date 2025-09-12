"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import EventInfo from "@/components/EventInfo";
import OrderItem from "@/components/OrderItem";
import OrderList from "@/components/OrderList";
import { useOrders, OrderWithMenuItem } from "@/hooks/useOrders";
import { useActiveEvent } from "@/hooks/useActiveEvent";
import { useAuth } from "@/contexts/AuthContext";
import { useGuestName } from "@/hooks/useGuestName";
import Button from "@/ui/button";

function OrderPageContent() {
  const { activeEvent } = useActiveEvent();
  const { orders: hookOrders, loading, error, refetch, updateOrder } = useOrders(
    activeEvent?.id
  );
  const { user } = useAuth();
  const { guestName } = useGuestName();
  const [finalizing, setFinalizing] = useState(false);
  const [localOrders, setLocalOrders] = useState<OrderWithMenuItem[]>([]);

  // Use local orders if available, otherwise use hook orders
  const orders = localOrders.length > 0 ? localOrders : hookOrders;

  // Update local orders when hook orders change
  useEffect(() => {
    setLocalOrders(hookOrders);
  }, [hookOrders]);

  // Optimistic update functions
  const handleOrderAdded = (newOrder: OrderWithMenuItem) => {
    setLocalOrders(prev => [newOrder, ...prev]);
  };

  const handleOrderRemoved = (orderId: string) => {
    setLocalOrders(prev => prev.filter(order => order.id !== orderId));
  };

  const handleOrderUpdated = (updatedOrder: OrderWithMenuItem) => {
    setLocalOrders(prev => 
      prev.map(order => order.id === updatedOrder.id ? updatedOrder : order)
    );
  };

  // Get current user's orders to check count
  const currentUserName =
    user?.user_metadata?.full_name || user?.email || guestName;
  const userOrders = orders.filter(
    (order) => order.user_name === currentUserName
  );
  const hasMultipleOrders = userOrders.length > 1;
  
  // Check if all user orders are already submitted
  const allOrdersSubmitted = userOrders.length > 0 && userOrders.every(order => order.is_submitted);

  return (
    <main className="flex items-center justify-center p-4 min-h-[calc(100vh-80px)]">
      <div className="w-full max-w-md mx-auto bg-gradient-to-b from-orange-300 to-orange-200 rounded-3xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-orange-400 text-center py-3 px-4 relative">
          <h1 className="text-xs font-medium text-slate-700 leading-tight">
            Place Your Order
          </h1>
        </div>

        <div className="p-6 space-y-6">
          {/* User Info */}
          <EventInfo className="mb-8" />

          {/* Order Section */}
          <div>
            <OrderItem onOrderAdded={refetch} />
          </div>

          {/* Order List */}
          <div>
            <OrderList
              orders={orders}
              loading={loading}
              error={error}
              onOrderAdded={handleOrderAdded}
              onOrderRemoved={handleOrderRemoved}
              onOrderUpdated={handleOrderUpdated}
            />
          </div>

          {/* Order Overview Button - Show when user has orders */}
          {userOrders.length > 0 && (
            <div className="pt-4 border-t border-slate-400/20 space-y-3">
              <Button
                fullWidth={true}
                variant="primary"
                className="bg-green-600 hover:bg-green-700 text-white"
                disabled={finalizing}
                onClick={async () => {
                  if (allOrdersSubmitted) {
                    // If all orders are already submitted, just navigate to overview
                    window.location.href = "/order-overview";
                  } else {
                    setFinalizing(true);
                    try {
                      // Mark all user's orders as submitted
                      const updatePromises = userOrders.map((order) =>
                        updateOrder(order.id, { is_submitted: true })
                      );
                      await Promise.all(updatePromises);

                      // Navigate to overview page
                      window.location.href = "/order-overview";
                    } catch (error) {
                      console.error("Failed to finalize orders:", error);
                      alert("Failed to finalize orders. Please try again.");
                      setFinalizing(false);
                    }
                  }
                }}
              >
                {finalizing
                  ? "Finalizing..."
                  : allOrdersSubmitted
                  ? "Order Overview"
                  : "Finalize Order"}
              </Button>
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
