import { useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useAuthStore from "../store/authStore";
import useSettingsStore from "../store/settingsStore";
import useAromaStore from "../store/aromaStore";
import {
  subscribePublicAromas,
  subscribeMyAromas,
} from "../firebase/aromaService";

const FAVORITES_KEY = "@aromaflow/favorites";

export default function StoreSubscriber() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const initAuthListener = useAuthStore((s) => s.initAuthListener);
  const sessionOnly = useSettingsStore((s) => s.sessionOnly);
  const setReady = useSettingsStore((s) => s.setReady);
  const ready = useSettingsStore((s) => s.ready);

  const setPublicAromas = useAromaStore((s) => s.setPublicAromas);
  const setCustomAromas = useAromaStore((s) => s.setCustomAromas);
  const setFavorites = useAromaStore((s) => s.setFavorites);
  const setSubError = useAromaStore((s) => s.setSubscriptionError);
  const incrementReady = useAromaStore((s) => s.incrementReady);
  const favorites = useAromaStore((s) => s.favorites);
  const resetSubscriptions = useAromaStore((s) => s.resetSubscriptions);
  const userId = currentUser?.uid;
  const favoritesKey = `${FAVORITES_KEY}_${userId || "guest"}`;
  const [hydratedKey, setHydratedKey] = useState(null);
  const restoringFavorites = useRef(false);

  useEffect(() => {
    return initAuthListener();
  }, [initAuthListener]);

  useEffect(() => {
    if (ready) return;
    setReady(true);
  }, [ready, setReady]);

  useEffect(() => {
    if (!ready || sessionOnly) return;
    let active = true;
    restoringFavorites.current = true;
    setFavorites([]);
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(favoritesKey);
        const stored = raw ? JSON.parse(raw) : [];
        if (
          !Array.isArray(stored) ||
          !stored.every(
            (id) => typeof id === "string" || typeof id === "number",
          )
        ) {
          throw new Error("Invalid favorites data");
        }
        if (active) setFavorites(stored);
      } catch {
        if (active) setSubError("Could not restore your saved favorites");
      } finally {
        if (active) {
          restoringFavorites.current = false;
          setHydratedKey({ key: favoritesKey });
        }
      }
    })();
    return () => {
      active = false;
    };
  }, [favoritesKey, ready, sessionOnly, setFavorites, setSubError]);

  useEffect(() => {
    resetSubscriptions();
    setCustomAromas([]);
    const publicFired = { current: false };
    const myFired = { current: false };

    const unsub1 = subscribePublicAromas(
      (list) => {
        setPublicAromas(list);
        if (!publicFired.current) {
          publicFired.current = true;
          incrementReady();
        }
      },
      (error) => {
        setSubError(error.message || "Failed to load public aromas");
        if (!publicFired.current) {
          publicFired.current = true;
          incrementReady();
        }
      },
    );

    if (!userId) {
      return () => unsub1();
    }

    const unsub2 = subscribeMyAromas(
      userId,
      (list) => {
        setCustomAromas(list);
        if (!myFired.current) {
          myFired.current = true;
          incrementReady();
        }
      },
      (error) => {
        setSubError(error.message || "Failed to load your aromas");
        if (!myFired.current) {
          myFired.current = true;
          incrementReady();
        }
      },
    );

    return () => {
      unsub1();
      unsub2();
    };
  }, [
    userId,
    setPublicAromas,
    setCustomAromas,
    setSubError,
    incrementReady,
    resetSubscriptions,
  ]);

  useEffect(() => {
    if (
      !ready ||
      sessionOnly ||
      restoringFavorites.current ||
      hydratedKey?.key !== favoritesKey
    )
      return;
    AsyncStorage.setItem(favoritesKey, JSON.stringify(favorites)).catch(() =>
      setSubError("Could not save your favorites on this device"),
    );
  }, [favorites, favoritesKey, hydratedKey, ready, sessionOnly, setSubError]);

  return null;
}
