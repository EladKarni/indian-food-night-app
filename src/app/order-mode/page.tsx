"use client";

import { Suspense, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useActiveEvent } from "@/hooks/useActiveEvent";
import { useOrders, OrderWithMenuItem } from "@/hooks/useOrders";
import ProtectedRoute from "@/components/ProtectedRoute";
import PageContainer from "@/ui/PageContainer";
import Card from "@/ui/Card";
import LoadingSpinner from "@/ui/LoadingSpinner";
import AlertMessage from "@/ui/AlertMessage";

interface GroupedOrder {
  item_name: string;
  price: number;
  spice_levels: { [key: string]: number }; // spice level -> count
  total_quantity: number;
  total_cost: number;
  indian_hot_count: number;
}

function OrderModePageContent() {
  const router = useRouter();
  const { user } = useAuth();
  const { activeEvent } = useActiveEvent();
  const { orders, loading, error } = useOrders(activeEvent?.id);

  // Check if current user is the host
  const isHost = user && activeEvent && activeEvent.host_id === user.id;

  // Filter orders to only include submitted ones
  const submittedOrders = useMemo(() => {
    return orders.filter(order => order.is_submitted);
  }, [orders]);

  // Group orders by menu item
  const groupedOrders = useMemo(() => {
    const groups: { [key: string]: GroupedOrder } = {};

    submittedOrders.forEach((order: OrderWithMenuItem) => {
      const itemName = order.menu_items.name;
      const spiceLevel = order.spice_level?.toString() || "0";
      
      if (!groups[itemName]) {
        groups[itemName] = {
          item_name: itemName,
          price: order.menu_items.price,
          spice_levels: {},
          total_quantity: 0,
          total_cost: 0,
          indian_hot_count: 0,
        };
      }

      // Count spice levels
      groups[itemName].spice_levels[spiceLevel] = (groups[itemName].spice_levels[spiceLevel] || 0) + 1;
      
      // Update totals
      groups[itemName].total_quantity += 1;
      groups[itemName].total_cost += order.menu_items.price;
      
      // Count indian hot
      if (order.is_indian_hot) {
        groups[itemName].indian_hot_count += 1;
      }
    });

    return Object.values(groups).sort((a, b) => a.item_name.localeCompare(b.item_name));
  }, [submittedOrders]);

  // Calculate grand total
  const grandTotal = useMemo(() => {
    return groupedOrders.reduce((sum, group) => sum + group.total_cost, 0);
  }, [groupedOrders]);

  // Get unique user count for extra rice reminder
  const uniqueUsers = useMemo(() => {
    const userNames = new Set(submittedOrders.map(order => order.user_name));
    return userNames.size;
  }, [submittedOrders]);

  // Redirect non-hosts using useEffect
  useEffect(() => {
    if (!isHost && activeEvent) {
      router.push("/order-overview");
    }
  }, [isHost, activeEvent, router]);

  // Don't render if not host
  if (!isHost) {
    return null;
  }

  if (loading) {
    return (
      <PageContainer variant="gradient">
        <Card variant="auth" className="w-full max-w-lg">
          <div className="p-6 text-center">
            <LoadingSpinner size="lg" text="Loading orders..." />
          </div>
        </Card>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer variant="gradient">
        <Card variant="auth" className="w-full max-w-lg">
          <div className="p-6 text-center">
            <AlertMessage type="error" className="mb-4">
              Error loading orders: {error}
            </AlertMessage>
            <Button onClick={() => router.push("/order-overview")}>Back to Overview</Button>
          </div>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer variant="gradient">
      <Card variant="auth" className="w-full max-w-lg">
        {/* Header */}
        <div className="bg-green-500 p-4 flex items-center relative">
          <h1 className="text-lg font-semibold text-white flex-1 text-center">
            📞 Order Mode
          </h1>
        </div>

        <div className="p-6 space-y-4">
          {/* Instructions */}
          <AlertMessage type="success" className="mb-4">
            📋 Ready to call in orders! Items are grouped by dish for easy ordering.
          </AlertMessage>

          {/* Extra Rice Reminder */}
          {uniqueUsers > 2 && (
            <AlertMessage type="warning" className="mb-4">
              🍚 Reminder: With {uniqueUsers} people ordering, consider asking for extra rice!
            </AlertMessage>
          )}

          {groupedOrders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-600 text-sm">No orders found for this event.</p>
            </div>
          ) : (
            <>
              {/* Grouped Orders */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {groupedOrders.map((group) => (
                  <div key={group.item_name} className="bg-white rounded-2xl p-4 shadow-md">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-slate-800 text-sm flex-1">
                        {group.item_name}
                      </h3>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">
                          {group.total_quantity}x
                        </div>
                        <div className="text-xs text-slate-500">
                          ${group.total_cost.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    
                    {/* Spice Level Breakdown */}
                    <div className="text-xs text-slate-600 space-y-1">
                      {Object.entries(group.spice_levels)
                        .sort(([a], [b]) => parseInt(a) - parseInt(b))
                        .filter(([spiceLevel]) => !(spiceLevel === "10" && group.indian_hot_count > 0))
                        .map(([spiceLevel, count]) => (
                          <div key={spiceLevel} className="flex justify-between">
                            <span>Spice Level {spiceLevel}:</span>
                            <span className="font-medium">{count}x</span>
                          </div>
                        ))}
                      
                      {/* Indian Hot - show instead of spice level 10 */}
                      {group.indian_hot_count > 0 && (
                        <div className="flex justify-between text-red-600 font-medium">
                          <span>Indian Hot 🌶️:</span>
                          <span>{group.indian_hot_count}x</span>
                        </div>
                      )}
                      
                      {/* Show remaining spice level 10 items that are NOT indian hot */}
                      {group.spice_levels["10"] && group.spice_levels["10"] > group.indian_hot_count && (
                        <div className="flex justify-between">
                          <span>Spice Level 10:</span>
                          <span className="font-medium">{group.spice_levels["10"] - group.indian_hot_count}x</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Grand Total */}
              <div className="mt-6 pt-4 border-t border-slate-300">
                <div className="bg-white rounded-2xl p-4 shadow-md">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-800 font-bold text-lg">
                      Total Items: {submittedOrders.length}
                    </span>
                    <div className="text-right">
                      <div className="text-slate-700">Subtotal: ${grandTotal.toFixed(2)}</div>
                      <div className="text-slate-700">Tax (7%): ${(grandTotal * 0.07).toFixed(2)}</div>
                      <div className="text-slate-800 font-bold text-xl">
                        Total: ${(grandTotal * 1.07).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            <Button
              fullWidth={true}
              variant="primary"
              onClick={() => router.push("/order-overview")}
              className="bg-blue-500 hover:bg-blue-600"
            >
              Back to Overview
            </Button>
            <Button
              fullWidth={true}
              variant="secondary"
              onClick={() => router.push("/dashboard")}
              className="bg-slate-600 hover:bg-slate-700"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </Card>
    </PageContainer>
  );
}

export default function OrderModePage() {
  return (
    <ProtectedRoute>
      <Suspense
        fallback={
          <PageContainer variant="gradient">
            <Card variant="auth" className="w-full max-w-lg">
              <div className="p-6 text-center">
                <LoadingSpinner size="lg" text="Loading..." />
              </div>
            </Card>
          </PageContainer>
        }
      >
        <OrderModePageContent />
      </Suspense>
    </ProtectedRoute>
  );
}