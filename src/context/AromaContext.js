import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "./AuthContext";
import { aromas } from "../data/aromas";
import {
  addAroma as fbAddAroma,
  deleteAroma as fbDeleteAroma,
  subscribeMyAromas,
  subscribePublicAromas,
  updateAroma as fbUpdateAroma,
} from "../firebase/aromaService";

const STORAGE_FAVORITES = "@aromaflow/favorites";

const AromaContext = createContext(null);

export function AromaProvider({ children }) {
  const { currentUser } = useAuth();
  const [customAromas, setCustomAromas] = useState([]);
  const [publicAromas, setPublicAromas] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [subscriptionsReady, setSubscriptionsReady] = useState(0);
  const [subscriptionError, setSubscriptionError] = useState(null);
  const userIdRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const userId = currentUser?.uid || "guest";

        if (userId === userIdRef.current) return;

        userIdRef.current = userId;

        const raw = await AsyncStorage.getItem(
          `${STORAGE_FAVORITES}_${userId}`,
        );

        if (raw) {
          setFavorites(JSON.parse(raw));
        } else {
          setFavorites([]);
        }
      } catch (e) {
        console.warn("Failed to load favorites", e);
      }
    })();
  }, [currentUser?.uid]);

  useEffect(() => {
    const userId = currentUser?.uid;

    setSubscriptionsReady(0);
    const publicFired = { current: false };
    const myFired = { current: false };

    const unsub1 = subscribePublicAromas(
      (list) => {
        setPublicAromas(list);
        if (!publicFired.current) {
          publicFired.current = true;
          setSubscriptionsReady((prev) => prev + 1);
        }
      },
      (error) => {
        console.error("Public aromas subscription error", error);
        setSubscriptionError(error.message || "Failed to load public aromas");
        if (!publicFired.current) {
          publicFired.current = true;
          setSubscriptionsReady((prev) => prev + 1);
        }
      },
    );

    if (!userId) {
      setCustomAromas([]);

      return () => {
        unsub1();
      };
    }

    const unsub2 = subscribeMyAromas(
      userId,
      (list) => {
        setCustomAromas(list);
        if (!myFired.current) {
          myFired.current = true;
          setSubscriptionsReady((prev) => prev + 1);
        }
      },
      (error) => {
        console.error("My aromas subscription error", error);
        setSubscriptionError(error.message || "Failed to load your aromas");
        if (!myFired.current) {
          myFired.current = true;
          setSubscriptionsReady((prev) => prev + 1);
        }
      },
    );

    return () => {
      unsub1();
      unsub2();
    };
  }, [currentUser?.uid]);

  const ready = currentUser ? subscriptionsReady >= 2 : subscriptionsReady >= 1;

  useEffect(() => {
    const userId = currentUser?.uid || "guest";

    AsyncStorage.setItem(
      `${STORAGE_FAVORITES}_${userId}`,
      JSON.stringify(favorites),
    ).catch(() => {});
  }, [favorites, currentUser?.uid]);

  const allNames = useMemo(() => {
    const builtin = aromas.map((a) => a.title);
    const custom = customAromas.map((a) => a.title);

    return [...builtin, ...custom];
  }, [customAromas]);

  const onToggleFavorite = useCallback((id) => {
    setFavorites((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }

      return [...prev, id];
    });
  }, []);

  const onAddAroma = useCallback(
    async (aroma) => {
      const newAroma = await fbAddAroma({
        ...aroma,
        ownerId: currentUser?.uid || "unknown",
        ownerName: currentUser?.displayName || "Unknown",
        visibility: aroma.visibility || "private",
      });

      return newAroma;
    },
    [currentUser],
  );

  const onDeleteAroma = useCallback(
    async (id) => {
      const target = customAromas.find((a) => a.id === id);

      if (target && target.ownerId !== currentUser?.uid) {
        console.warn("Owner mismatch: cannot delete another user's aroma");

        return;
      }

      await fbDeleteAroma(id);
      setFavorites((prev) => prev.filter((fid) => fid !== id));
    },
    [customAromas, currentUser],
  );

  const onUpdateAroma = useCallback(
    async (id, updates) => {
      const target = customAromas.find((a) => a.id === id);

      if (target && target.ownerId !== currentUser?.uid) {
        console.warn("Owner mismatch: cannot update another user's aroma");

        return;
      }

      await fbUpdateAroma(id, updates);
    },
    [customAromas, currentUser],
  );

  const myAromas = useMemo(() => {
    if (!currentUser) return [];

    return customAromas;
  }, [customAromas, currentUser]);

  return (
    <AromaContext.Provider
      value={{
        customAromas,
        myAromas,
        publicAromas,
        favorites,
        allNames,
        ready,
        subscriptionError,
        onToggleFavorite,
        onAddAroma,
        onDeleteAroma,
        onUpdateAroma,
      }}
    >
      {children}
    </AromaContext.Provider>
  );
}

export function useAromas() {
  const ctx = useContext(AromaContext);

  if (!ctx) {
    throw new Error("useAromas must be used within AromaProvider");
  }

  return ctx;
}
