import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteEvent } from "@/lib/eventService";
import { eventKeys } from "@/lib/queries/keys";

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (vars: { eventId: string; userId: string }) => {
      const { error } = await deleteEvent(vars.eventId, vars.userId);
      if (error) throw new Error(error);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: eventKeys.active() }),
  });

  return {
    deleteEvent: (eventId: string, userId: string) =>
      mutation.mutateAsync({ eventId, userId }),
    loading: mutation.isPending,
    error: mutation.error ? mutation.error.message : null,
    reset: mutation.reset,
  };
};
