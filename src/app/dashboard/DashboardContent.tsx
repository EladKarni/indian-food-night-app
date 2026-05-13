"use client";

import { useCallback, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useActiveEvent } from "@/hooks/useActiveEvent";
import { useOrders } from "@/hooks/useOrders";
import { useDeleteEvent } from "@/hooks/useDeleteEvent";
import { useDashboardActions } from "@/hooks/useDashboardActions";
import ActionList from "@/components/dashboard/ActionList";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardGreeting from "@/components/dashboard/DashboardGreeting";
import NextEventCard from "@/components/dashboard/NextEventCard";
import EmptyEventCard from "@/components/dashboard/EmptyEventCard";
import DeleteEventConfirm from "@/components/dashboard/DeleteEventConfirm";

function getFirstName(
  fullName: string | undefined,
  email: string | undefined
): string {
  return (
    fullName?.split(" ")[0] ||
    email?.split("@")[0] ||
    "there"
  );
}

export default function DashboardContent() {
  const { user } = useAuth();
  const { activeEvent } = useActiveEvent();
  const { orders } = useOrders(activeEvent?.id);
  const {
    deleteEvent,
    loading: deleteLoading,
    error: deleteError,
    reset: resetDelete,
  } = useDeleteEvent();

  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const isHost = !!user && !!activeEvent && activeEvent.host_id === user.id;

  const firstName = useMemo(
    () =>
      getFirstName(
        user?.user_metadata?.full_name as string | undefined,
        user?.email
      ),
    [user]
  );

  const handleDeleteRequest = useCallback(() => setConfirmingDelete(true), []);

  const actionRows = useDashboardActions({
    activeEvent,
    isHost,
    orderCount: orders.length,
    onDeleteRequest: handleDeleteRequest,
  });

  if (!user) return null;

  const handleDeleteConfirm = async () => {
    if (!activeEvent) return;
    try {
      await deleteEvent(activeEvent.id, user.id);
      setConfirmingDelete(false);
    } catch {
      // error surfaced via deleteError; keep the confirm open so the user sees it
    }
  };

  const handleDeleteCancel = () => {
    setConfirmingDelete(false);
    resetDelete();
  };

  return (
    <main className="ifn-screen ifn-app">
      <div style={{ maxWidth: 420, margin: "0 auto", width: "100%", flex: 1 }}>
        <DashboardTopbar isHost={isHost} />

        <div className="ifn-screen-pad" style={{ paddingTop: 12 }}>
          <DashboardGreeting
            firstName={firstName}
            isHost={isHost}
            hasEvent={!!activeEvent}
          />

          {activeEvent ? (
            <NextEventCard
              event={activeEvent}
              orderCount={orders.length}
              isHost={isHost}
            />
          ) : (
            <EmptyEventCard />
          )}

          <ActionList rows={actionRows} />

          {confirmingDelete && activeEvent && (
            <DeleteEventConfirm
              loading={deleteLoading}
              error={deleteError}
              onCancel={handleDeleteCancel}
              onConfirm={handleDeleteConfirm}
            />
          )}
        </div>
      </div>
    </main>
  );
}
