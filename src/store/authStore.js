import { create } from "zustand";
import {
  onAuthChanged,
  registerUser as fbRegister,
  signIn as fbSignIn,
  signOut as fbSignOut,
} from "../firebase/authService";

const useAuthStore = create((set) => ({
  currentUser: null,
  loading: true,

  initAuthListener: () => {
    const unsubscribe = onAuthChanged((user) => {
      set({ currentUser: user, loading: false });
    });
    return unsubscribe;
  },

  login: async (email, password) => {
    await fbSignIn(email, password);
    return true;
  },

  register: async (email, password, displayName) => {
    await fbRegister(email, password, displayName);
    return true;
  },

  logout: async () => {
    await fbSignOut();
    set({ currentUser: null });
  },
}));

export default useAuthStore;
