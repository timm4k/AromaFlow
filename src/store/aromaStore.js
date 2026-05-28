import { create } from "zustand";
import {
  addAroma as fbAddAroma,
  deleteAroma as fbDeleteAroma,
  updateAroma as fbUpdateAroma,
} from "../firebase/aromaService";
import { aromas } from "../data/aromas";
import useAuthStore from "./authStore";

const useAromaStore = create((set, get) => ({
  publicAromas: [],
  customAromas: [],
  favorites: [],
  subscriptionError: null,
  subscriptionsReady: 0,

  setPublicAromas: (list) => set({ publicAromas: list }),
  setCustomAromas: (list) => set({ customAromas: list }),
  setFavorites: (ids) => set({ favorites: ids }),
  setSubscriptionError: (err) => set({ subscriptionError: err }),
  incrementReady: () =>
    set((s) => ({ subscriptionsReady: s.subscriptionsReady + 1 })),

  toggleFavorite: (id) =>
    set((state) => ({
      favorites: state.favorites.includes(id)
        ? state.favorites.filter((f) => f !== id)
        : [...state.favorites, id],
    })),

  addAroma: async (aroma) => {
    const { currentUser } = useAuthStore.getState();
    return await fbAddAroma({
      ...aroma,
      ownerId: currentUser?.uid || "unknown",
      ownerName: currentUser?.displayName || "Unknown",
      visibility: aroma.visibility || "private",
    });
  },

  deleteAroma: async (id) => {
    const { currentUser } = useAuthStore.getState();
    const target = get().customAromas.find((a) => a.id === id);
    if (target && target.ownerId !== currentUser?.uid) {
      console.warn("Owner mismatch: cannot delete another user's aroma");
      return;
    }
    await fbDeleteAroma(id);
    set((state) => ({
      favorites: state.favorites.filter((fid) => fid !== id),
    }));
  },

  updateAroma: async (id, updates) => {
    const { currentUser } = useAuthStore.getState();
    const target = get().customAromas.find((a) => a.id === id);
    if (target && target.ownerId !== currentUser?.uid) {
      console.warn("Owner mismatch: cannot update another user's aroma");
      return;
    }
    await fbUpdateAroma(id, updates);
  },
}));

function getAllNames() {
  const state = useAromaStore.getState();
  const builtin = aromas.map((a) => a.title);
  const custom = state.customAromas.map((a) => a.title);
  return [...builtin, ...custom];
}

function isReady(currentUser) {
  const state = useAromaStore.getState();
  return currentUser
    ? state.subscriptionsReady >= 2
    : state.subscriptionsReady >= 1;
}

export { getAllNames, isReady };
export default useAromaStore;
