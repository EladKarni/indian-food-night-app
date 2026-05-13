import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEvent } from "@/lib/eventService";
import { eventKeys } from "@/lib/queries/keys";
import type { TablesInsert } from "@/types/supabase-types";

export const useCreateEvent = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (input: TablesInsert<"events">) => {
      const { data, error } = await createEvent(input);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: eventKeys.active() }),
  });

  return {
    createEvent: (input: TablesInsert<"events">) => mutation.mutateAsync(input),
    loading: mutation.isPending,
    error: mutation.error ? mutation.error.message : null,
    reset: mutation.reset,
  };
};
