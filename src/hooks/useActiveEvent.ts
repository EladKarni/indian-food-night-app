import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { fetchActiveEvent, type Event } from "@/lib/queries/events";
import { eventKeys } from "@/lib/queries/keys";

export type { Event };

export const useActiveEvent = () => {
  const queryClient = useQueryClient();

  const { data, isPending, error } = useQuery({
    queryKey: eventKeys.active(),
    queryFn: fetchActiveEvent,
    enabled: !!supabase,
  });

  const refreshActiveEvent = () =>
    queryClient.invalidateQueries({ queryKey: eventKeys.active() });

  return {
    activeEvent: data ?? null,
    loading: isPending,
    error: error ? error.message : null,
    refreshActiveEvent,
  };
};
