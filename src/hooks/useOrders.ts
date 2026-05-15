import { useCallback, useEffect } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import {
  fetchOrdersByEvent,
  type OrderRow,
  type MenuItemRow,
  type OrderWithMenuItem,
} from "@/lib/queries/orders";
import { orderKeys } from "@/lib/queries/keys";
import type { TablesInsert, TablesUpdate } from "@/types/supabase-types";

export type { OrderRow, MenuItemRow, OrderWithMenuItem };
export type CreateOrderData = TablesInsert<"orders">;
export type UpdateOrderData = TablesUpdate<"orders">;

export const useOrders = (eventId?: string) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const {
    data,
    isPending,
    error,
    refetch: queryRefetch,
  } = useQuery({
    queryKey: orderKeys.list(eventId),
    queryFn: () => fetchOrdersByEvent(eventId as string),
    enabled: !!supabase && !!eventId,
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: orderKeys.list(eventId) });

  useEffect(() => {
    if (!supabase || !eventId) return;
    const channel = supabase
      .channel(`orders-${eventId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
        },
        (payload) => {
          const row = (payload.new ?? payload.old) as { event_id?: string };
          if (row?.event_id !== eventId) return;
          queryClient.invalidateQueries({ queryKey: orderKeys.list(eventId) });
        }
      )
      .subscribe();
    return () => {
      supabase?.removeChannel(channel);
    };
  }, [eventId, queryClient]);

  const addMutation = useMutation({
    mutationFn: async (vars: {
      orderData: CreateOrderData;
      guestName?: string;
    }) => {
      if (!supabase) {
        throw new Error("Supabase client not available");
      }
      if (!user && !vars.guestName?.trim()) {
        throw new Error("Guest name is required when not logged in");
      }
      const userName =
        user?.user_metadata?.full_name || user?.email || vars.guestName;

      const { data, error } = await supabase
        .from("orders")
        .insert({
          ...vars.orderData,
          user_name: userName,
          user_id: user?.id || null,
        })
        .select("*, menu_items (*)")
        .single();

      if (error) throw error;
      return data as OrderWithMenuItem;
    },
    onSuccess: invalidate,
  });

  const updateMutation = useMutation({
    mutationFn: async (vars: {
      orderId: string;
      updates: UpdateOrderData;
    }) => {
      if (!supabase) {
        throw new Error("Supabase client not available");
      }
      const { data, error } = await supabase
        .from("orders")
        .update(vars.updates)
        .eq("id", vars.orderId)
        .select("*, menu_items (*)")
        .single();

      if (error) throw error;
      return data as OrderWithMenuItem;
    },
    onSuccess: invalidate,
  });

  const removeMutation = useMutation({
    mutationFn: async (orderId: string) => {
      if (!supabase) {
        throw new Error("Supabase client not available");
      }
      const { error } = await supabase
        .from("orders")
        .delete()
        .eq("id", orderId);

      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const setAttendeePaidMutation = useMutation({
    mutationFn: async (vars: {
      eventId: string;
      userName: string;
      isPaid: boolean;
    }) => {
      if (!supabase) {
        throw new Error("Supabase client not available");
      }
      const { error } = await supabase
        .from("orders")
        .update({ is_paid: vars.isPaid })
        .eq("event_id", vars.eventId)
        .eq("user_name", vars.userName);

      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const addOrder = useCallback(
    (orderData: CreateOrderData, guestName?: string) =>
      addMutation.mutateAsync({ orderData, guestName }),
    [addMutation]
  );

  const updateOrder = useCallback(
    (orderId: string, updates: UpdateOrderData) =>
      updateMutation.mutateAsync({ orderId, updates }),
    [updateMutation]
  );

  const removeOrder = useCallback(
    (orderId: string) => removeMutation.mutateAsync(orderId),
    [removeMutation]
  );

  const setAttendeePaid = useCallback(
    (eventId: string, userName: string, isPaid: boolean) =>
      setAttendeePaidMutation.mutateAsync({ eventId, userName, isPaid }),
    [setAttendeePaidMutation]
  );

  const refetch = useCallback(async () => {
    await queryRefetch();
  }, [queryRefetch]);

  const mutationError =
    addMutation.error ||
    updateMutation.error ||
    removeMutation.error ||
    setAttendeePaidMutation.error;

  return {
    orders: data ?? [],
    loading: !eventId || isPending,
    actionLoading:
      addMutation.isPending ||
      updateMutation.isPending ||
      removeMutation.isPending ||
      setAttendeePaidMutation.isPending,
    error: error
      ? error.message
      : mutationError
      ? mutationError.message
      : null,
    addOrder,
    updateOrder,
    removeOrder,
    setAttendeePaid,
    clearError: () => {
      addMutation.reset();
      updateMutation.reset();
      removeMutation.reset();
      setAttendeePaidMutation.reset();
    },
    refetch,
  };
};
