import useAromaStore, { getAllNames } from "../store/aromaStore";
import useAuthStore from "../store/authStore";

export function useAromas() {
  const state = useAromaStore();
  const currentUser = useAuthStore((s) => s.currentUser);
  const myAromas = currentUser ? state.customAromas : [];
  const allNames = getAllNames();
  const ready = currentUser
    ? state.subscriptionsReady >= 2
    : state.subscriptionsReady >= 1;

  return {
    customAromas: state.customAromas,
    myAromas,
    publicAromas: state.publicAromas,
    favorites: state.favorites,
    allNames,
    ready,
    subscriptionError: state.subscriptionError,
    onToggleFavorite: state.toggleFavorite,
    onAddAroma: state.addAroma,
    onDeleteAroma: state.deleteAroma,
    onUpdateAroma: state.updateAroma,
  };
}
