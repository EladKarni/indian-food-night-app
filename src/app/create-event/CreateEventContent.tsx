"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useCreateEvent } from "@/hooks/useCreateEvent";
import { useCreateEventForm } from "@/hooks/useCreateEventForm";
import CreateEventForm from "./CreateEventForm";
import CreateEventTopbar from "./CreateEventTopbar";

export default function CreateEventContent() {
  const { user } = useAuth();
  const router = useRouter();
  const { values, handleChange, cutoffPreview } = useCreateEventForm({
    defaultLocation: user?.user_metadata.address,
  });
  const { createEvent, loading } = useCreateEvent();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await createEvent({
        event_date: values.event_date,
        location: values.location,
        restaurant: values.restaurant,
        start_time: values.time,
        cutoff_minutes_before: values.cutoff_minutes_before,
        host_id: user.id,
      });
      router.push("/dashboard");
    } catch (err) {
      console.error("Error creating event:", err);
    }
  };

  return (
    <main className="ifn-screen ifn-app">
      <div style={{ maxWidth: 420, margin: "0 auto", width: "100%", flex: 1 }}>
        <CreateEventTopbar />

        <div className="ifn-screen-pad" style={{ paddingTop: 10 }}>
          <div className="ifn-display" style={{ fontSize: 38, marginBottom: 6 }}>
            Host the
            <br />
            next round.
          </div>
          <p
            style={{
              color: "var(--ifn-muted)",
              fontSize: 14,
              marginBottom: 26,
            }}
          >
            We pre-fill the boring parts — change anything that&apos;s not quite right.
          </p>

          <CreateEventForm
            values={values}
            submitting={loading}
            cutoffPreview={cutoffPreview}
            onChange={handleChange}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </main>
  );
}
