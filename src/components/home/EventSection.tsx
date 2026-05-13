"use client";

import { useActiveEvent } from "@/hooks/useActiveEvent";
import EventSectionEmpty from "./EventSectionEmpty";
import EventSectionCard from "./EventSectionCard";

export default function EventSection() {
  const { activeEvent } = useActiveEvent();

  if (!activeEvent) {
    return <EventSectionEmpty />;
  }
  return <EventSectionCard event={activeEvent} />;
}
