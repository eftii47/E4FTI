import { useEffect, useState } from "react";
import type { Profile } from "@shared/schema";

export function useProfile() {
  const [data, setData] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Try /api/profile first, fall back to /profile.json if it fails
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/profile');
        if (!res.ok) throw new Error('Failed to fetch /api/profile');
        const profile = await res.json();
        setData(profile);
      } catch (err) {
        // fallback to /profile.json
        try {
          const res = await fetch('./profile.json');
          if (!res.ok) throw new Error('Failed to fetch ./profile.json');
          const profile = await res.json();
          setData(profile);
        } catch (err2) {
          setError(err2 instanceof Error ? err2 : new Error('Unknown error'));
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  return { data, isLoading, error };
}
