import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Tables } from "@/types/supabase-types";

export type HostProfile = Tables<"profiles">;

export const useHostProfile = (hostId?: string) => {
  const [hostProfile, setHostProfile] = useState<HostProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hostId || !supabase) {
      setHostProfile(null);
      setLoading(false);
      return;
    }

    const fetchHostProfile = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", hostId)
          .single();

        if (error) {
          throw error;
        }

        setHostProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch host profile");
        setHostProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchHostProfile();
  }, [hostId]);

  return { hostProfile, loading, error };
};