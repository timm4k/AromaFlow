import { useQuery } from "@tanstack/react-query";
import { fetchInspirations } from "../api/inspirationsApi";

export function useInspirations() {
  return useQuery({
    queryKey: ["inspirations"],
    queryFn: fetchInspirations,
  });
}
