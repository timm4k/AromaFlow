import { useQuery } from "@tanstack/react-query";
import { fetchScentPhoto, photoThumbnailWidth } from "./scentPhotos";
import { querySettings } from "./querySettings";

export function useScentPhoto(subject: string, enabled = true) {
  return useQuery({
    queryKey: ["scent-photo", subject, photoThumbnailWidth, "cached-file"],
    enabled,
    queryFn: ({ signal }) => fetchScentPhoto(subject, signal),
    staleTime: querySettings.photoCacheDuration,
    gcTime: querySettings.photoCacheDuration,
    retry: false,
    refetchOnWindowFocus: false,
  });
}
