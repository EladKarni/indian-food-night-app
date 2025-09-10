"use client";

import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { getNextWednesday } from "@/util/dateUtils";
import Link from "next/link";
import router from "next/router";
import { useState } from "react";

export default function CreateEventContent() {
  const { user } = useAuth();

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

      router.push("/order");
    } catch (err) {
      console.error("Error creating event:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Create Event</h1>
        <p className="text-base-content/60">
          Host a new Indian food night event
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title mb-4">Event Details</h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">
                    <span className="label-text font-medium">Date *</span>
                  </label>
                  <input
                    type="date"
                    name="event_date"
                    value={formData.event_date}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    required
                  />
                </div>

                <div>
                  <label className="label">
                    <span className="label-text font-medium">Time *</span>
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="label">
                  <span className="label-text font-medium">
                    Restaurant <i>(optional - defaults to Coriander)</i>
                  </span>
                </label>
                <input
                  type="text"
                  name="restaurant"
                  value={formData.restaurant}
                  onChange={handleInputChange}
                  placeholder="Coriander Indian Grill"
                  className="input input-bordered w-full"
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text font-medium">Location *</span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Coriander Indian Grill"
                  className="input input-bordered w-full"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 justify-end">
          <Link href="/dashboard" className="btn btn-outline">
            Cancel
          </Link>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Creating...
              </>
            ) : (
              "Create Event"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
