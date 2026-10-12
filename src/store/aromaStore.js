import { create } from "zustand";
import {
  addAroma as fbAddAroma,
  deleteAroma as fbDeleteAroma,
  updateAroma as fbUpdateAroma,
} from "../firebase/aromaService";
import useAuthStore from "./authStore";

function ensureAromaOwner(state, user, id) {
  const aroma =
    state.customAromas.find((entry) => entry.id === id) ||
    state.publicAromas.find((entry) => entry.id === id);
  if (!user || !aroma || aroma.ownerId !== user.uid) {
    throw new Error("You can only change your own aromas");
  }
}

const useAromaStore = create((set, get) => ({
  publicAromas: [],
  customAromas: [],
  favorites: [],
  subscriptionError: null,
  subscriptionsReady: 0,
  resetSubscriptions: () =>
    set({ subscriptionsReady: 0, subscriptionError: null }),

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
    if (!currentUser) throw new Error("Sign in to create an aroma");
    return fbAddAroma({
      ...aroma,
      ownerId: currentUser.uid,
      ownerName: currentUser.displayName || "Unknown",
      visibility: aroma.visibility || "private",
    });
  },

  deleteAroma: async (id) => {
    const { currentUser } = useAuthStore.getState();
    ensureAromaOwner(get(), currentUser, id);
    await fbDeleteAroma(id);
    set((state) => ({
      favorites: state.favorites.filter((fid) => fid !== id),
    }));
  },

  updateAroma: async (id, updates) => {
    const { currentUser } = useAuthStore.getState();
    ensureAromaOwner(get(), currentUser, id);
    await fbUpdateAroma(id, updates);
  },
}));

export default useAromaStore;
