import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth } from "./AuthContext";
import { aromas } from "../data/aromas";
import {
  loadCustomAromas,
  loadFavorites,
  saveCustomAromas,
  saveFavorites,
} from "../storage/aromaStorage";

const AromaContext = createContext(null);

let customIdCounter = 0;

export function AromaProvider({ children }) {
  const { currentUser } = useAuth();
  const [customAromas, setCustomAromas] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [savedAromas, savedFavorites] = await Promise.all([
          loadCustomAromas(),
          loadFavorites(currentUser?.id),
        ]);

        if (savedAromas.length > 0) {
          setCustomAromas(savedAromas);

          savedAromas.forEach((a) => {
            const m = a.id.match(/custom_(\d+)_/);

            if (m) {
              customIdCounter = Math.max(
                customIdCounter,
                parseInt(m[1], 10) + 1,
              );
            }
          });
        }

        if (savedFavorites.length > 0) {
          setFavorites(savedFavorites);
        }
      } catch (e) {
        console.warn("Failed to load aromas", e);
      } finally {
        setReady(true);
      }
    })();
  }, [currentUser?.id]);

  useEffect(() => {
    if (!ready) return;

    saveCustomAromas(customAromas);
  }, [customAromas, ready]);

  useEffect(() => {
    if (!ready || !currentUser?.id) return;

    saveFavorites(currentUser.id, favorites);
  }, [favorites, ready, currentUser?.id]);

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
    (aroma) => {
      customIdCounter += 1;

      const newAroma = {
        ...aroma,
        id: `custom_${customIdCounter}_${Date.now()}`,
        isCustom: true,
        createdAt: Date.now(),
        ownerId: currentUser?.id || "unknown",
        ownerName: currentUser?.displayName || "Unknown",
        visibility: aroma.visibility || "private",
      };

      setCustomAromas((prev) => [newAroma, ...prev]);
    },
    [currentUser],
  );

  const onDeleteAroma = useCallback(
    (id) => {
      const target = customAromas.find((a) => a.id === id);

      if (target && target.ownerId !== currentUser?.id) {
        console.warn("Owner mismatch: cannot delete another user's aroma");

        return;
      }

      setCustomAromas((prev) => prev.filter((a) => a.id !== id));
      setFavorites((prev) => prev.filter((fid) => fid !== id));
    },
    [customAromas, currentUser],
  );

  const onUpdateAroma = useCallback(
    (id, updates) => {
      const target = customAromas.find((a) => a.id === id);

      if (target && target.ownerId !== currentUser?.id) {
        console.warn("Owner mismatch: cannot update another user's aroma");

        return;
      }

      setCustomAromas((prev) =>
        prev.map((a) => (a.id === id ? { ...a, ...updates } : a)),
      );
    },
    [customAromas, currentUser],
  );

  const myAromas = useMemo(() => {
    if (!currentUser) return [];

    return customAromas.filter((a) => a.ownerId === currentUser.id);
  }, [customAromas, currentUser]);

  const publicAromas = useMemo(() => {
    return customAromas.filter((a) => a.visibility === "public");
  }, [customAromas]);

  return (
    <AromaContext.Provider
      value={{
        customAromas,
        myAromas,
        publicAromas,
        favorites,
        allNames,
        ready,
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
