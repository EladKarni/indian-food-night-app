"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import Button from "@/ui/button";
import ProtectedRoute from "@/components/ProtectedRoute";
import FormInput from "@/ui/FormInput";
import FormTextarea from "@/ui/FormTextarea";
import FormLabel from "@/ui/FormLabel";
import LoadingSpinner from "@/ui/LoadingSpinner";
import PageContainer from "@/ui/PageContainer";
import Card from "@/ui/Card";

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
    <PageContainer variant="gradient">
      <Card variant="auth" className="w-full max-w-md">
        {/* Header */}
        <div className="bg-orange-400 text-center py-3 px-4 relative">
          <h1 className="text-lg font-semibold text-slate-700">
            Edit Profile
          </h1>
        </div>

        <div className="p-6 space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <LoadingSpinner size="lg" text="Loading profile..." />
            </div>
          ) : (
            <>
              {/* Full Name */}
              <div>
                <FormLabel>
                  Full Name
                </FormLabel>
                <FormInput
                  type="text"
                  value={profile.full_name}
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
                <FormLabel>
                  Email
                </FormLabel>
                <FormInput
                  type="email"
                  value={profile.email}
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
                <FormLabel>
                  Address
                </FormLabel>
                <FormTextarea
                  value={profile.address}
                  onChange={(e) => handleAddressChange(e.target.value)}
                  placeholder="Enter your address"
                  rows={3}
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
      </Card>
    </PageContainer>
  );
}

export default function EditProfilePage() {
  return (
    <ProtectedRoute>
      <EditProfilePageContent />
    </ProtectedRoute>
  );
}