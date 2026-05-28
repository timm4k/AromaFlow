import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

const storage = createJSONStorage(() => ({
  getItem: async (name) => AsyncStorage.getItem(name),
  setItem: async (name, value) => {
    const s = useSettingsStore.getState();
    if (s.sessionOnly) return;
    return AsyncStorage.setItem(name, value);
  },
  removeItem: async (name) => AsyncStorage.removeItem(name),
}));

const useSettingsStore = create(
  persist(
    (set) => ({
      darkMode: false,
      pastelMode: true,
      favoritesOnly: false,
      compactCards: false,
      showEmojis: true,
      enableAnimations: true,
      accentIntensity: "medium",
      fontSize: "medium",
      sessionOnly: false,
      ready: false,

      setDarkMode: (v) => set({ darkMode: v }),
      setPastelMode: (v) => set({ pastelMode: v }),
      setFavoritesOnly: (v) => set({ favoritesOnly: v }),
      setCompactCards: (v) => set({ compactCards: v }),
      setShowEmojis: (v) => set({ showEmojis: v }),
      setEnableAnimations: (v) => set({ enableAnimations: v }),
      setAccentIntensity: (v) => set({ accentIntensity: v }),
      setFontSize: (v) => set({ fontSize: v }),
      setSessionOnly: (v) => set({ sessionOnly: v }),
      setReady: (v) => set({ ready: v }),
    }),
    {
      name: "@aromaflow/settings",
      storage,
      partialize: (state) => {
        const { ready, ...persistable } = state;
        return persistable;
      },
    },
  ),
);

export default useSettingsStore;
