"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/ui/button";
import UserInfo from "@/components/UserInfo";
import { useMenu } from "@/contexts/MenuContext";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { MenuItem } from "@/util/menuData";

interface OrderItem {
  id: string;
  itemName: string;
  spiceLevel: number;
  indianHot: boolean;
}

interface EventData {
  id: string;
  event_date: string;
  location: string;
  host_id: string;
  participant_count: number;
}

type OrderItemApiResponse = {
  id: string;
  menu_items: MenuItem;
  spice_level: number;
  is_indian_hot: boolean;
  menu_item: MenuItem;
};

function OrderOverviewPageContent() {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const router = useRouter();
  const { menuItems, isLoading: menuLoading, error: menuError } = useMenu();
  const { user } = useAuth();

  useEffect(() => {
    const fetchEventData = async () => {
      if (!supabase) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .gte("event_date", "now()")
          .single();

        if (error) {
          console.error("Error fetching event:", error);
          return;
        }

        setEventData(data);
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();

    const fetchSavedItemData = async () => {
      if (!supabase || !user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("orders")
          .select("id, spice_level, is_indian_hot, menu_items (id, name)")
          .eq("user_id", user?.id)
          .overrideTypes<OrderItemApiResponse[]>();

        if (error) {
          console.error("Error fetching orders:", error);
          return;
        }

        if (!data || data.length === 0) {
          setLoading(false);
          return;
        }
        console.log({ data });
        setOrderItems(
          data.map((order_item) => ({
            id: order_item.id,
            menu_item_id: order_item.menu_items.id,
            itemName: order_item.menu_items.name,
            spiceLevel: order_item.spice_level,
            indianHot: order_item.is_indian_hot,
          }))
        );
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedItemData();
  }, [user]);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="loading loading-spinner loading-md mb-4"></div>
        <p className="text-center text-slate-700 text-xs">Loading...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-200 via-rose-300 to-slate-500 flex items-center justify-center p-4">
      <div className="w-full max-w-sm mx-auto bg-gradient-to-b from-orange-300 to-orange-200 rounded-3xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-orange-400 p-4 flex items-center relative">
          <h1 className="text-lg font-semibold text-slate-700 flex-1 text-center">
            Your Order
          </h1>
        </div>

        <div className="p-6">
          {/* User Info */}
          <div className="mb-6">
            <UserInfo showProfilePicture={false} className="mb-4" />
            <p className="text-slate-600 text-sm italic">
              You&apos;re all set for IFN. Feel free to text the host if you
              have any question
            </p>
          </div>

          {/* Order Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              Your Order
            </h2>

            {/* Show loading state while menu is loading */}
            {menuLoading ? (
              <div className="text-center py-8">
                <div className="loading loading-spinner loading-md mb-4"></div>
                <p className="text-center text-slate-700 text-xs">
                  Loading menu prices...
                </p>
              </div>
            ) : menuError ? (
              <div className="text-center py-8">
                <div className="text-red-500 mb-4">⚠️</div>
                <p className="text-center text-red-600 text-xs">{menuError}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {orderItems.map((item, index) => {
                  const menuItem = menuItems.find(
                    (mi) =>
                      mi.name.toLowerCase() === item.itemName.toLowerCase()
                  );
                  const itemPrice = menuItem?.price || 0;

                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl p-3 flex items-center justify-between"
                    >
                      <div className="flex-1">
                        <span className="text-slate-800 text-sm font-medium">
                          {item.itemName || "Unnamed Item"}
                        </span>
                        <div className="text-xs text-slate-500 mt-1">
                          Spice Level: {item.spiceLevel}
                          {item.indianHot ? " (Indian Hot)" : ""}
                        </div>
                        {!menuItem && (
                          <div className="text-xs text-orange-600 mt-1">
                            Price not available
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="text-orange-400 font-bold text-xl">
                          {item.spiceLevel}
                        </span>
                        <div className="text-xs text-slate-500 mt-1">
                          {isCalculating ? "..." : `$${itemPrice.toFixed(2)}`}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Total */}
            {orderItems.length > 0 && !menuLoading && !menuError && (
              <div className="mt-4 pt-4 border-t border-slate-300">
                <div className="flex justify-between items-center">
                  <span className="text-slate-800 font-semibold">Total:</span>
                  <span className="text-slate-800 font-bold text-lg">
                    {orderItems
                      .reduce((total, item) => {
                        const menuItem = menuItems.find(
                          (mi) =>
                            mi.name.toLowerCase() ===
                            item.itemName.toLowerCase()
                        );
                        const itemPrice = menuItem?.price || 0;
                        return total + itemPrice;
                      }, 0)
                      .toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              fullWidth={true}
              variant="primary"
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
          <div className="w-full max-w-sm mx-auto bg-gradient-to-b from-orange-300 to-orange-200 rounded-3xl overflow-hidden shadow-2xl">
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
