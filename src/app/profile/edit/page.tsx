"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import Button from "@/ui/button";
import ProtectedRoute from "@/components/ProtectedRoute";

interface ProfileData {
  full_name: string;
  email: string;
  address: string;
}

function EditProfilePageContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<ProfileData>({
    full_name: "",
    email: "",
    address: "",
  });

  useEffect(() => {
    if (!user) return;

    // Initialize with user data
    setProfile({
      full_name: user.user_metadata?.full_name || "",
      email: user.email || "",
      address: "",
    });

    // Fetch existing profile data
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    if (!user || !supabase) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        // PGRST116 is "not found" error, which is okay for new profiles
        throw error;
      }

      if (data) {
        setProfile({
          full_name: data.full_name || user.user_metadata?.full_name || "",
          email: data.email || user.email || "",
          address: data.address || "",
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user || !supabase) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          email: profile.email,
          full_name: profile.full_name,
          address: profile.address,
          updated_at: new Date().toISOString(),
        });

      if (error) {
        throw error;
      }

      // Profile updated successfully

      router.push("/dashboard");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleAddressChange = (value: string) => {
    setProfile(prev => ({ ...prev, address: value }));
  };

  if (!user) return null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-200 via-rose-300 to-slate-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto bg-gradient-to-b from-orange-300 to-orange-200 rounded-3xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-orange-400 text-center py-3 px-4 relative">
          <h1 className="text-lg font-semibold text-slate-700">
            Edit Profile
          </h1>
        </div>

        <div className="p-6 space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="loading loading-spinner loading-md mb-4"></div>
              <p className="text-slate-700">Loading profile...</p>
            </div>
          ) : (
            <>
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profile.full_name}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-100 text-slate-600 cursor-not-allowed"
                  placeholder="Full name from your account"
                  readOnly
                  disabled
                />
                <p className="text-xs text-slate-500 mt-1">
                  Name cannot be changed here. Contact support if needed.
                </p>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={profile.email}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-100 text-slate-600 cursor-not-allowed"
                  placeholder="Email from your account"
                  readOnly
                  disabled
                />
                <p className="text-xs text-slate-500 mt-1">
                  Email cannot be changed here. Contact support if needed.
                </p>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Address
                </label>
                <textarea
                  value={profile.address}
                  onChange={(e) => handleAddressChange(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none h-20 resize-none"
                  placeholder="Enter your address"
                />
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4">
                <Button
                  fullWidth={true}
                  variant="primary"
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
                
                <Button
                  fullWidth={true}
                  variant="secondary"
                  onClick={() => router.push("/dashboard")}
                  disabled={saving}
                  className="bg-slate-600 hover:bg-slate-700"
                >
                  Cancel
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

export default function EditProfilePage() {
  return (
    <ProtectedRoute>
      <EditProfilePageContent />
    </ProtectedRoute>
  );
}