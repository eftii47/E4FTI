import { staticProfile } from "@/staticProfile";

export function useProfile() {
  return {
    data: staticProfile,
    isLoading: false,
    error: null,
  };
}
