import { useQuery } from "@tanstack/react-query";
import { fetchInspirations } from "../api/inspirationsApi";

export function usePosts() {
  return useQuery({
    queryKey: ["inspirations"],
    queryFn: fetchInspirations,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}
