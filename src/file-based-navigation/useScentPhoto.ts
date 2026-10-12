import { useQuery } from "@tanstack/react-query";
import { fetchScentPhoto } from "./scentPhotos";
import { querySettings } from "./querySettings";

export function useScentPhoto(subject: string, enabled = true) {
  return useQuery({
    queryKey: ["scent-photo", subject],
    enabled,
    queryFn: ({ signal }) => fetchScentPhoto(subject, signal),
    staleTime: querySettings.photoCacheDuration,
    gcTime: querySettings.photoCacheDuration,
    retry: false,
    refetchOnWindowFocus: false,
  });
}
