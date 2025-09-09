"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { getNextWednesday } from "@/util/dateUtils";

export default function DashboardContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [eventCode, setEventCode] = useState("");
  const [profileForm, setProfileForm] = useState({
    full_name: "",
    phone: "",
    address: "",
    dietary_restrictions: "",
  });

  useEffect(() => {
    fetchEvents();
    fetchUserProfile();
  }, [user]);

  const fetchEvents = async () => {
    if (!supabase) return;

    try {
      // Calculate the next Wednesday date
      const today = new Date();
      const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
      const daysUntilWednesday =
        dayOfWeek <= 3 ? 3 - dayOfWeek : 7 - dayOfWeek + 3;

      const nextWednesday = new Date(today);
      nextWednesday.setDate(today.getDate() + daysUntilWednesday);
      const wednesdayDateString = nextWednesday.toISOString().split("T")[0];

      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("event_date", wednesdayDateString) // Look for events on this Wednesday
        .order("created_at", { ascending: false }); // Get the most recent if multiple
      console.log(data);
      if (!error) {
        // Show the Wednesday event if it exists
        const wednesdayEvents = data || [];
        setEvents(wednesdayEvents.length > 0 ? [wednesdayEvents[0]] : []);
      }
    } catch (err) {
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    if (!supabase || !user) return;

    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!error) {
        setProfileForm({
          full_name: data?.full_name || "",
          phone: data?.phone || "",
          address: data?.address || "",
          dietary_restrictions: data?.dietary_restrictions || "",
        });
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  const handleJoinEvent = async (eventId?: string) => {
    if (!supabase || !user) return;

    const targetEventId = eventId || eventCode;
    if (!targetEventId) return;

    try {
      const { error } = await supabase.from("event_participants").insert({
        event_id: targetEventId,
        user_id: user.id,
        user_email: user.email,
      });

      if (!error) {
        setShowJoinModal(false);
        setEventCode("");
        fetchEvents();
      }
    } catch (err) {
      console.error("Error joining event:", err);
    }
  };

  const handleCreateEvent = () => {
    router.push("/create-event");
  };

  const handleProfileUpdate = async () => {
    if (!supabase || !user) return;

    try {
      const { error } = await supabase.from("user_profiles").upsert({
        id: user.id,
        email: user.email,
        full_name: profileForm.full_name,
        phone: profileForm.phone,
        address: profileForm.address,
        dietary_restrictions: profileForm.dietary_restrictions,
        updated_at: new Date().toISOString(),
      });

      if (!error) {
        setShowEditModal(false);
        fetchUserProfile();
      }
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  const handleProfileInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-orange-200 via-rose-300 to-slate-500 flex items-center justify-center p-4">
        <div className="w-full max-w-xs mx-auto bg-gradient-to-b from-orange-300 to-orange-200 rounded-3xl overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="bg-orange-400 text-center py-3 px-4 relative">
            <h1 className="text-xs font-medium text-slate-700 leading-tight">
              Welcome back,{" "}
              {user?.user_metadata?.full_name || user?.email?.split("@")[0]}!
            </h1>
          </div>

          <div className="p-6">
            {/* User Info */}
            <div className="mb-8">
              <div className="text-center">
                <h2 className="text-lg font-bold text-slate-800 mb-4">
                  Dashboard
                </h2>

                {/* Action Buttons */}
                <div className="space-y-3 mb-6">
                  <button
                    onClick={handleCreateEvent}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-2xl transition-colors text-sm"
                  >
                    📅 Create Event
                  </button>

                  <button
                    onClick={() => setShowEditModal(true)}
                    className="w-full bg-slate-600 hover:bg-slate-700 text-white font-medium py-3 px-4 rounded-2xl transition-colors text-sm"
                  >
                    👤 Edit Profile
                  </button>
                </div>
              </div>
            </div>

            {/* Next Event Section */}
            <div>
              <h2 className="text-lg font-bold text-slate-800 mb-1">
                Next Event
              </h2>

              {loading ? (
                <div className="text-center py-8">
                  <div className="loading loading-spinner loading-md mb-4"></div>
                  <p className="text-center text-slate-700 text-xs">
                    Loading next event...
                  </p>
                </div>
              ) : events.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">📅</div>
                  <p className="text-center text-slate-700 text-xs mb-4">
                    No event scheduled for this Wednesday
                  </p>
                  <button
                    onClick={handleCreateEvent}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-xl text-xs transition-colors"
                  >
                    Create Wednesday Event
                  </button>
                </div>
              ) : (
                <div className="mt-4">
                  {events.map((event) => {
                    const eventDate = new Date(event.event_date);
                    const today = new Date();
                    const isToday =
                      eventDate.toDateString() === today.toDateString();
                    const daysUntil = Math.ceil(
                      (eventDate.getTime() - today.getTime()) /
                        (1000 * 60 * 60 * 24)
                    );

                    return (
                      <div
                        key={event.id}
                        className="bg-white rounded-2xl p-4 border-2 border-orange-200"
                      >
                        <div className="text-center mb-4">
                          <div className="text-4xl mb-2">🍛</div>
                          <h3 className="text-slate-800 text-lg font-bold mb-1">
                            Indian Food Night
                          </h3>
                          <div className="text-sm text-slate-600 mb-2">
                            {isToday ? (
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                                🎉 Today!
                              </span>
                            ) : daysUntil === 1 ? (
                              <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full font-medium">
                                Tomorrow
                              </span>
                            ) : (
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                                In {daysUntil} days
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="text-center text-sm text-slate-600 mb-4 space-y-1">
                          <p className="font-medium">
                            📅{" "}
                            {eventDate.toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                          {event.location && <p>📍 {event.location}</p>}
                          <p>
                            👥 {event.participant_count}{" "}
                            {event.participant_count === 1
                              ? "person"
                              : "people"}{" "}
                            attending
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              router.push(`/order?eventId=${event.id}`)
                            }
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-3 rounded-xl text-sm transition-colors"
                          >
                            🍛 Order Food
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Join Event Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-b from-orange-300 to-orange-200 rounded-3xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="font-bold text-lg text-slate-800 mb-2">
              Join Event
            </h3>
            <p className="text-sm text-slate-700 mb-4">
              Enter the event code to join:
            </p>
            <input
              type="text"
              placeholder="Event Code"
              className="w-full px-4 py-3 bg-white/70 border-none rounded-2xl placeholder-slate-500 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white mb-4"
              value={eventCode}
              onChange={(e) => setEventCode(e.target.value)}
            />
            <div className="flex gap-2">
              <button
                className="flex-1 bg-slate-400 hover:bg-slate-500 text-white font-medium py-2 px-4 rounded-2xl text-sm transition-colors"
                onClick={() => setShowJoinModal(false)}
              >
                Cancel
              </button>
              <button
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-2xl text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => handleJoinEvent()}
                disabled={!eventCode}
              >
                Join
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-b from-orange-300 to-orange-200 rounded-3xl p-6 w-full max-w-sm max-h-[90vh] overflow-y-auto shadow-2xl">
            <h3 className="font-bold text-lg text-slate-800 mb-4">
              Edit Profile
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="full_name"
                  placeholder="Your full name"
                  className="w-full px-4 py-3 bg-white/70 border-none rounded-2xl placeholder-slate-500 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white"
                  value={profileForm.full_name}
                  onChange={handleProfileInputChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Your phone number"
                  className="w-full px-4 py-3 bg-white/70 border-none rounded-2xl placeholder-slate-500 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white"
                  value={profileForm.phone}
                  onChange={handleProfileInputChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  placeholder="Your address (used as default event location)"
                  className="w-full px-4 py-3 bg-white/70 border-none rounded-2xl placeholder-slate-500 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white"
                  value={profileForm.address}
                  onChange={handleProfileInputChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Dietary Restrictions
                </label>
                <textarea
                  name="dietary_restrictions"
                  placeholder="Any dietary restrictions or preferences..."
                  className="w-full px-4 py-3 bg-white/70 border-none rounded-2xl placeholder-slate-500 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white h-20 resize-none"
                  value={profileForm.dietary_restrictions}
                  onChange={handleProfileInputChange}
                />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                className="flex-1 bg-slate-400 hover:bg-slate-500 text-white font-medium py-2 px-4 rounded-2xl text-sm transition-colors"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-2xl text-sm transition-colors"
                onClick={handleProfileUpdate}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
