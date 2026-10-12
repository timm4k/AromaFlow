import { useMemo } from "react";
import { aromas } from "../data/aromas";
import useAromaStore from "../store/aromaStore";
import useAuthStore from "../store/authStore";

const builtinNames = aromas.map((aroma) => aroma.title);

export function useAromas() {
  const state = useAromaStore();
  const currentUser = useAuthStore((s) => s.currentUser);
  const myAromas = currentUser ? state.customAromas : [];
  const allNames = useMemo(
    () => [...builtinNames, ...state.customAromas.map((aroma) => aroma.title)],
    [state.customAromas],
  );
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
