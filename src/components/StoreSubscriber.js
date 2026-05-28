import { useEffect } from "react";
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

  useEffect(() => {
    return initAuthListener();
  }, [initAuthListener]);

  useEffect(() => {
    if (ready) return;
    setReady(true);
  }, [ready, setReady]);

  useEffect(() => {
    if (!ready || sessionOnly) return;
    (async () => {
      try {
        const uid = currentUser?.uid || "guest";
        const raw = await AsyncStorage.getItem(`${FAVORITES_KEY}_${uid}`);
        if (raw) setFavorites(JSON.parse(raw));
      } catch {}
    })();
  }, [currentUser?.uid, ready, sessionOnly, setFavorites]);

  useEffect(() => {
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
        console.error("Public aromas subscription error", error);
        setSubError(error.message || "Failed to load public aromas");
        if (!publicFired.current) {
          publicFired.current = true;
          incrementReady();
        }
      },
    );

    if (!currentUser) {
      setCustomAromas([]);
      return () => unsub1();
    }

    const unsub2 = subscribeMyAromas(
      currentUser.uid,
      (list) => {
        setCustomAromas(list);
        if (!myFired.current) {
          myFired.current = true;
          incrementReady();
        }
      },
      (error) => {
        console.error("My aromas subscription error", error);
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
  }, [currentUser?.uid]);

  useEffect(() => {
    if (!ready || sessionOnly) return;
    const uid = currentUser?.uid || "guest";
    AsyncStorage.setItem(
      `${FAVORITES_KEY}_${uid}`,
      JSON.stringify(favorites),
    ).catch(() => {});
  }, [favorites, currentUser?.uid, ready, sessionOnly]);

  return null;
}
