import { useMemo } from "react";
import type { Event } from "@/lib/queries/events";
import type { ActionRow } from "@/components/dashboard/ActionList";
import {
  CopyIcon,
  EditIcon,
  TrashIcon,
  UserIcon,
} from "@/components/dashboard/icons";

interface UseDashboardActionsParams {
  activeEvent: Event | null;
  isHost: boolean;
  orderCount: number;
  onDeleteRequest: () => void;
}

export const useDashboardActions = ({
  activeEvent,
  isHost,
  orderCount,
  onDeleteRequest,
}: UseDashboardActionsParams): ActionRow[] => {
  return useMemo(() => {
    const rows: ActionRow[] = [];

    if (isHost && activeEvent) {
      rows.push({
        label: "Edit event",
        icon: EditIcon,
        href: `/edit-event/${activeEvent.id}`,
      });
    }

    if (activeEvent && orderCount > 1) {
      rows.push({
        label: "Review group order",
        icon: CopyIcon,
        href: "/order-overview",
      });
    }

    rows.push({
      label: "Order history",
      icon: CopyIcon,
      href: "/order-history",
    });

    rows.push({
      label: "Edit profile & spice",
      icon: UserIcon,
      href: "/profile/edit",
    });

    if (isHost && activeEvent) {
      rows.push({
        label: "Delete event",
        icon: TrashIcon,
        danger: true,
        onClick: onDeleteRequest,
      });
    }

    return rows;
  }, [activeEvent, isHost, orderCount, onDeleteRequest]);
};
