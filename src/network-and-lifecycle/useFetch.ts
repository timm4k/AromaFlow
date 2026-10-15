import { useCallback, useEffect, useState } from "react";

export interface FetchState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useFetch<T>(url: string, options?: RequestInit): FetchState<T> {
  const [version, setVersion] = useState(0);
  const [state, setState] = useState({
    url,
    data: null as T | null,
    isLoading: true,
    error: null as string | null,
  });
  const refetch = useCallback(() => setVersion((value) => value + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    let cancelled = false;
    async function load() {
      setState((previous) => ({
        url,
        data: previous.url === url ? previous.data : null,
        isLoading: true,
        error: null,
      }));
      try {
        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
        });
        if (!response.ok)
          throw new Error(`Request failed (${response.status})`);
        const data: T = await response.json();
        if (active && !controller.signal.aborted)
          setState((previous) => ({ ...previous, data }));
      } catch (error) {
        if (
          !active ||
          controller.signal.aborted ||
          (error instanceof Error && error.name === "AbortError")
        ) {
          cancelled = true;
          return;
        }
        setState((previous) => ({
          ...previous,
          error:
            error instanceof Error
              ? error.message
              : "Could not reach the server",
        }));
      } finally {
        if (active && !controller.signal.aborted && !cancelled)
          setState((previous) => ({ ...previous, isLoading: false }));
      }
    }
    void load();
    return () => {
      active = false;
      controller.abort();
    };
  }, [url, version, options]);

  return {
    data: state.url === url ? state.data : null,
    isLoading: state.url !== url || state.isLoading,
    error: state.url === url ? state.error : null,
    refetch,
  };
}
