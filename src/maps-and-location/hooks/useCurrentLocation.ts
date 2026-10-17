import { useCallback, useEffect, useRef, useState } from "react";
import * as Location from "expo-location";
import { isValidCoordinates } from "../coordinates";
import type { Coordinates } from "../types/map";

export function useCurrentLocation() {
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const session = useRef({ active: false, busy: false, version: 0 });

  useEffect(() => {
    const current = session.current;
    current.active = true;
    return () => {
      current.active = false;
      current.busy = false;
      current.version++;
    };
  }, []);

  const fetchLocation = useCallback(async () => {
    const current = session.current;
    if (current.busy || !current.active) return;
    current.busy = true;
    const currentVersion = ++current.version;
    setLoading(true);
    setError(null);
    try {
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const { latitude, longitude } = position.coords;
      if (!isValidCoordinates({ latitude, longitude })) {
        throw new Error("The device returned invalid coordinates");
      }
      if (current.active && current.version === currentVersion)
        setCoords({ latitude, longitude });
    } catch (reason) {
      if (current.active && current.version === currentVersion) {
        setError(
          reason instanceof Error
            ? reason.message
            : "Could not get your location — check location services and try again",
        );
      }
    } finally {
      if (current.version === currentVersion) {
        current.busy = false;
        if (current.active) setLoading(false);
      }
    }
  }, []);

  return { coords, loading, error, fetchLocation };
}
