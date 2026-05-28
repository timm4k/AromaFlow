import { useTheme } from "../context/ThemeContext";
import { useAromas } from "../context/AromaContext";
import AromasScreen from "../screens/AromasScreen";
import MyAromasScreen from "../screens/MyAromasScreen";
import AddAromaScreen from "../screens/AddAromaScreen";

export function AromasTab() {
  const { theme, compactCards, showEmojis, enableAnimations, favoritesOnly } = useTheme();
  const { favorites, onToggleFavorite } = useAromas();

  return (
    <AromasScreen
      theme={theme}
      compactCards={compactCards}
      favorites={favorites}
      favoritesOnly={favoritesOnly}
      onToggleFavorite={onToggleFavorite}
      showEmojis={showEmojis}
      enableAnimations={enableAnimations}
    />
  );
}

export function MyAromasTab() {
  const { theme, enableAnimations } = useTheme();
  const { myAromas, favorites, onToggleFavorite, onDeleteAroma, onUpdateAroma } = useAromas();

  return (
    <MyAromasScreen
      theme={theme}
      customAromas={myAromas}
      favorites={favorites}
      onToggleFavorite={onToggleFavorite}
      onDeleteAroma={onDeleteAroma}
      onUpdateAroma={onUpdateAroma}
      enableAnimations={enableAnimations}
    />
  );
}

export function AddTab() {
  const { theme, enableAnimations } = useTheme();
  const { onAddAroma, allNames } = useAromas();

  return (
    <AddAromaScreen
      theme={theme}
      onAdd={onAddAroma}
      existingNames={allNames}
      enableAnimations={enableAnimations}
    />
  );
}
