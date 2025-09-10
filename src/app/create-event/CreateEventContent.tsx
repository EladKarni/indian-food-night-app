"use client";

import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { getNextWednesday } from "@/util/dateUtils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import PageContainer from "@/ui/PageContainer";
import Card from "@/ui/Card";
import FormInput from "@/ui/FormInput";
import FormLabel from "@/ui/FormLabel";
import Button from "@/ui/button";
import LoadingSpinner from "@/ui/LoadingSpinner";

export default function CreateEventContent() {
  const { user } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    event_date: new Date(getNextWednesday()).toISOString().split("T")[0],
    time: "18:30",
    restaurant: "Coriander Indian Grill",
    location: user?.user_metadata.address,
  });

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
    if (!supabase || !user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("events")
        .insert({
          event_date: formData.event_date,
          location: formData.location,
          restaurant: formData.restaurant,
          start_time: formData.time,
          host_id: user.id,
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating event:", error);
        return;
      }

      router.push("/dashboard");
    } catch (err) {
      console.error("Error creating event:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer variant="dashboard">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Create Event</h1>
        <p className="text-base-content/60">
          Host a new Indian food night event
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
                  placeholder="Coriander Indian Grill"
                  variant="daisyui"
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
              <LoadingSpinner size="sm" text="Creating..." />
            ) : (
              "Create Event"
            )}
          </Button>
        </div>
      </form>
    </PageContainer>
  );
}
