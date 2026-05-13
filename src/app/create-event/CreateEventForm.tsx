"use client";

import CutoffField from "@/components/create-event/CutoffField";
import EventDateTimeFields from "@/components/create-event/EventDateTimeFields";
import HostInfoCallout from "@/components/create-event/HostInfoCallout";
import LocationField from "@/components/create-event/LocationField";
import RestaurantField from "@/components/create-event/RestaurantField";
import CreateEventFormActions from "@/components/create-event/CreateEventFormActions";
import type { CreateEventFormValues } from "@/hooks/useCreateEventForm";

interface CreateEventFormProps {
  values: CreateEventFormValues;
  submitting: boolean;
  cutoffPreview: string | null;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function CreateEventForm({
  values,
  submitting,
  cutoffPreview,
  onChange,
  onSubmit,
}: CreateEventFormProps) {
  return (
    <form onSubmit={onSubmit}>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <EventDateTimeFields
          date={values.event_date}
          time={values.time}
          onChange={onChange}
        />
        <RestaurantField value={values.restaurant} onChange={onChange} />
        <LocationField value={values.location} onChange={onChange} />
        <CutoffField
          value={values.cutoff_minutes_before}
          cutoffPreview={cutoffPreview}
          onChange={onChange}
        />
      </div>

      <HostInfoCallout />

      <CreateEventFormActions submitting={submitting} />
    </form>
  );
}
