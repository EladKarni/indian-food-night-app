"use client";

import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { updateEvent } from "@/lib/eventService";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import PageContainer from "@/ui/PageContainer";
import Card from "@/ui/Card";
import FormInput from "@/ui/FormInput";
import FormLabel from "@/ui/FormLabel";
import Button from "@/ui/button";
import LoadingSpinner from "@/ui/LoadingSpinner";

interface EventData {
  id: string;
  event_date: string;
  start_time: string | null;
  restaurant: string | null;
  location: string;
  host_id: string | null;
}

export default function EditEventPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [fetchingEvent, setFetchingEvent] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [formData, setFormData] = useState({
    event_date: "",
    time: "",
    restaurant: "",
    location: "",
  });

  // Fetch event data
  useEffect(() => {
    const fetchEvent = async () => {
      if (!supabase || !eventId) return;

      try {
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .eq("id", eventId)
          .single();

        if (error) {
          setError("Failed to fetch event data");
          return;
        }

        if (!data) {
          setError("Event not found");
          return;
        }

        // Check if user is the host
        if (!user || data.host_id !== user.id) {
          setError("You are not authorized to edit this event");
          return;
        }

        setEventData(data);
        setFormData({
          event_date: data.event_date,
          time: data.start_time || "18:30",
          restaurant: data.restaurant || "Coriander Indian Grill",
          location: data.location,
        });
      } catch (err) {
        setError("Failed to fetch event data");
      } finally {
        setFetchingEvent(false);
      }
    };

    fetchEvent();
  }, [eventId, user]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !eventData) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await updateEvent(
        eventId,
        {
          event_date: formData.event_date,
          location: formData.location,
          restaurant: formData.restaurant,
          start_time: formData.time,
        },
        user.id
      );

      if (error) {
        setError(error);
        return;
      }

      // Navigate back to dashboard after successful update
      router.push("/dashboard");
    } catch (err) {
      setError("Failed to update event");
    } finally {
      setLoading(false);
    }
  };

  if (fetchingEvent) {
    return (
      <PageContainer variant="dashboard">
        <div className="text-center">
          <LoadingSpinner size="lg" text="Loading event..." />
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer variant="dashboard">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Error</h1>
          <p className="mb-4">{error}</p>
          <Link href="/dashboard" className="btn btn-primary">
            Back to Dashboard
          </Link>
        </div>
      </PageContainer>
    );
  }

  if (!eventData) {
    return null;
  }

  return (
    <PageContainer variant="dashboard">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Edit Event</h1>
        <p className="text-base-content/60">
          Update your Indian food night event details
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card variant="daisyui">
          <div className="card-body">
            <h2 className="card-title mb-4">Event Details</h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <FormLabel variant="daisyui" required>
                    Date
                  </FormLabel>
                  <FormInput
                    type="date"
                    name="event_date"
                    value={formData.event_date}
                    onChange={handleInputChange}
                    variant="daisyui"
                    required
                  />
                </div>

                <div>
                  <FormLabel variant="daisyui" required>
                    Time
                  </FormLabel>
                  <FormInput
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    variant="daisyui"
                    required
                  />
                </div>
              </div>

              <div>
                <FormLabel variant="daisyui">
                  Restaurant <i>(optional - defaults to Coriander)</i>
                </FormLabel>
                <FormInput
                  type="text"
                  name="restaurant"
                  value={formData.restaurant}
                  onChange={handleInputChange}
                  placeholder="Coriander Indian Grill"
                  variant="daisyui"
                />
              </div>
              <div>
                <FormLabel variant="daisyui" required>
                  Location
                </FormLabel>
                <FormInput
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Event location"
                  variant="daisyui"
                  required
                />
              </div>
            </div>
          </div>
        </Card>

        <div className="flex gap-4 justify-end">
          <Link href="/dashboard" className="btn btn-outline">
            Cancel
          </Link>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? (
              <LoadingSpinner size="sm" text="Updating..." />
            ) : (
              "Update Event"
            )}
          </Button>
        </div>
      </form>
    </PageContainer>
  );
}