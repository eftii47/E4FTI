import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useProfile() {
  return useQuery({
    queryKey: [api.profile.get.path],
    queryFn: async () => {
      const res = await fetch(api.profile.get.path, { credentials: "include" });
      if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error("Failed to fetch profile");
      }
      return api.profile.get.responses[200].parse(await res.json());
    },
  });
}
