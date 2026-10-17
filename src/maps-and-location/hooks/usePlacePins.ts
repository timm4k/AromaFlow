import { useCallback, useEffect, useRef, useState } from "react";
import { defaultPlaceTitle } from "../placeOptions";
import { loadSavedPlaces, storeSavedPlaces } from "../services/placeStorage";
import type { Coordinates, PlacePin } from "../types/map";

export function usePlacePins(profileId: string) {
  const [pins, setPins] = useState<PlacePin[]>([]);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const session = useRef({ active: false, busy: false, sequence: 0 });

  useEffect(() => {
    const current = session.current;
    current.active = true;
    let cancelled = false;
    void loadSavedPlaces(profileId).then(
      (saved) => {
        if (cancelled) return;
        setPins(saved);
        setStorageError(null);
        setReady(true);
      },
      () => {
        if (!cancelled)
          setStorageError(
            "Could not load your saved places — retry before adding pins",
          );
      },
    );
    return () => {
      cancelled = true;
      current.active = false;
    };
  }, [profileId, loadAttempt]);

  const addPin = useCallback((coordinate: Coordinates) => {
    const pin: PlacePin = {
      id: `${Date.now()}-${++session.current.sequence}`,
      title: defaultPlaceTitle,
      coordinate,
      createdAt: new Date().toLocaleString(),
      icon: "📍",
      saved: false,
    };
    setPins((previous) => [...previous, pin]);
    return pin.id;
  }, []);

  const changePin = useCallback(
    async (id: string, replacement: PlacePin | null) => {
      const current = session.current;
      if (!ready || current.busy || !current.active) return false;
      const existing = pins.find((pin) => pin.id === id);
      if (!existing) return false;
      current.busy = true;
      setBusy(true);
      const next = replacement
        ? pins.map((pin) => (pin.id === id ? replacement : pin))
        : pins.filter((pin) => pin.id !== id);
      try {
        if (existing.saved || replacement?.saved)
          await storeSavedPlaces(profileId, next);
        if (current.active) {
          setPins(next);
          setStorageError(null);
        }
        return true;
      } catch {
        if (current.active)
          setStorageError(
            "Could not update saved places — your previous pins are unchanged",
          );
        return false;
      } finally {
        current.busy = false;
        if (current.active) setBusy(false);
      }
    },
    [pins, profileId, ready],
  );

  const retryLoad = useCallback(() => setLoadAttempt((value) => value + 1), []);
  return { pins, ready, busy, storageError, addPin, changePin, retryLoad };
}
