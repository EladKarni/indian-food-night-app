"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/ui/button";
import OrderItem from "@/components/OrderItem";
import UserInfo from "@/components/UserInfo";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { faqItems } from "@/constants/faq";

interface OrderItemData {
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

// Suggest adding this type definition at the top of your file or in a types file
type MenuItem = {
  id: string;
  name: string;
  // add other properties if needed
};

type OrderItemApiResponse = {
  id: string;
  menu_items: MenuItem;
  spice_level: number;
  is_indian_hot: boolean;
  menu_item: MenuItem;
};

function OrderPageContent() {
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItemData[]>([]);
  const [currentOrderStates, setCurrentOrderStates] = useState<
    Map<string, OrderItemData>
  >(new Map());
  const [loading, setLoading] = useState(true);
  const router = useRouter();
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

  const addOrderItem = () => {
    const newItem: OrderItemData = {
      id: "2b531e9f-c1bb-48ea-aadd-a7eba0aa0f3e",
      itemName: "",
      spiceLevel: 1,
      indianHot: false,
    };
    setOrderItems([...orderItems, newItem]);
  };

  const duplicateOrderItem = (id: string) => {
    const itemToDuplicate = orderItems.find((item) => item.id === id);
    if (itemToDuplicate) {
      const duplicatedItem: OrderItemData = {
        ...itemToDuplicate,
        id: Date.now().toString(),
      };
      setOrderItems([...orderItems, duplicatedItem]);
    }
  };

  const removeOrderItem = async (id: string) => {
    setOrderItems(orderItems.filter((item) => item.id !== id));
    // Also remove from current states
    setCurrentOrderStates((prev) => {
      const newStates = new Map(prev);
      newStates.delete(id);
      return newStates;
    });
    if (!supabase) return;
    const { error } = await supabase.from("orders").delete().eq("id", id);
    console.log({ error });
  };

  const handleItemChange = useCallback(
    (id: string, itemName: string, spiceLevel: number, indianHot: boolean) => {
      setCurrentOrderStates((prev) => {
        const newStates = new Map(prev);
        newStates.set(id, { id, itemName, spiceLevel, indianHot });
        return newStates;
      });
    },
    []
  );

  // Auto-save order to localStorage whenever orderItems or currentOrderStates change
  useEffect(() => {
    if (!eventData?.id) return;

    if (orderItems.length > 0) {
      const currentOrder = orderItems.map((item) => {
        const currentState = currentOrderStates.get(item.id);
        return currentState || item;
      });
      localStorage.setItem(
        `order_${eventData?.id}`,
        JSON.stringify(currentOrder)
      );
    } else {
      // Clear localStorage if no items
      localStorage.removeItem(`order_${eventData?.id}`);
    }
  }, [orderItems, currentOrderStates, eventData?.id]);

  // Check if all items have non-empty names
  const isSubmitEnabled =
    orderItems.length > 0 &&
    orderItems.every((item) => {
      const currentState = currentOrderStates.get(item.id);
      return currentState && currentState.itemName.trim().length > 0;
    });

  const submitOrder = async () => {
    if (!supabase || !user || !eventData?.id || !eventData) {
      console.error("Missing required data for order submission:", {
        supabase: !!supabase,
        user: !!user,
        eventId: !!eventData?.id,
        eventData: !!eventData,
      });
      return;
    }

    console.log("Submitting order for event:", eventData.id);
    // Use current states instead of initial states

    try {
      // Save order to Supabase - make sure eventId is the UUID from Supabase
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .upsert(
          orderItems.map((item) => {
            const currentState = currentOrderStates.get(item.id);
            return {
              event_id: eventData.id,
              user_id: user.id,
              menu_item_id: item.id,
              spice_level: currentState?.spiceLevel || 0,
              is_indian_hot: currentState?.indianHot || 0,
            };
          })
        );

      if (orderError) {
        console.error("Error creating order:", orderError);
        return;
      }

      // Clear localStorage after successful submission
      localStorage.removeItem(`order_${eventData?.id}`);

      // Navigate to order overview page
      router.push(`/order-overview?eventId=${eventData?.id}`);
    } catch (error) {
      console.error("Error submitting order:", error);
    }
  };

  if (loading) {
    return (
      <main className="flex items-center justify-center p-4 min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-xs mx-auto bg-gradient-to-b from-orange-300 to-orange-200 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-6 text-center">
            <div className="loading loading-spinner loading-md mb-4"></div>
            <p className="text-slate-700">Loading event...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!eventData) {
    return (
      <main className="flex items-center justify-center p-4 min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-xs mx-auto bg-gradient-to-b from-orange-300 to-orange-200 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-6 text-center">
            <p className="text-slate-700">Event not found</p>
            <button
              className="btn btn-primary mt-4"
              onClick={() => router.push("/dashboard")}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex items-center justify-center p-4 min-h-[calc(100vh-80px)]">
      <div className="w-full max-w-xs mx-auto bg-gradient-to-b from-orange-300 to-orange-200 rounded-3xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-orange-400 text-center py-3 px-4 relative">
          <h1 className="text-xs font-medium text-slate-700 leading-tight">
            Event: {new Date(eventData.event_date).toLocaleDateString()} -{" "}
            {eventData.location}
          </h1>
        </div>

        <div className="p-6">
          {/* User Info */}
          <UserInfo className="mb-8" />

          {/* Order Section */}
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-1">
              Ordering From: Coriander India Grill
            </h2>

            <Button fullWidth={true} onClick={addOrderItem}>
              Add To Order
            </Button>

            {orderItems.length === 0 ? (
              <p className="text-center text-slate-700 text-xs mt-4">
                You currently have nothing in your order
              </p>
            ) : (
              <div className="mt-4">
                <p className="text-center text-slate-700 text-xs mb-4">
                  Your Order ({orderItems.length} item
                  {orderItems.length !== 1 ? "s" : ""})
                </p>
                <div className="space-y-3">
                  {orderItems.map((item) => (
                    <OrderItem
                      key={item.id}
                      id={item.id}
                      initialItemName={item.itemName}
                      initialSpiceLevel={item.spiceLevel}
                      initialIndianHot={item.indianHot}
                      onDuplicate={duplicateOrderItem}
                      onRemove={removeOrderItem}
                      onItemChange={handleItemChange}
                    />
                  ))}
                </div>

                {/* Submit Order Button - Only show if at least one item */}
                {orderItems.length > 0 && (
                  <div className="mt-6">
                    <Button
                      fullWidth={true}
                      variant="primary"
                      onClick={submitOrder}
                      disabled={!isSubmitEnabled}
                      className={`transition-all duration-200 ${
                        isSubmitEnabled
                          ? "bg-green-500 hover:bg-green-600 focus:ring-green-400"
                          : "bg-gray-400 cursor-not-allowed opacity-50"
                      }`}
                    >
                      {isSubmitEnabled
                        ? `Submit Order (${orderItems.length} items)`
                        : "Complete all items to submit"}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
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
          <div className="w-full max-w-xs mx-auto bg-gradient-to-b from-orange-300 to-orange-200 rounded-3xl overflow-hidden shadow-2xl">
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
