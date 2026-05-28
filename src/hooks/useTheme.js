import { useMemo } from "react";
import useSettingsStore from "../store/settingsStore";
import { getTheme } from "../styles/colors";

export function useTheme() {
  const darkMode = useSettingsStore((s) => s.darkMode);
  const pastelMode = useSettingsStore((s) => s.pastelMode);
  const favoritesOnly = useSettingsStore((s) => s.favoritesOnly);
  const compactCards = useSettingsStore((s) => s.compactCards);
  const showEmojis = useSettingsStore((s) => s.showEmojis);
  const enableAnimations = useSettingsStore((s) => s.enableAnimations);
  const accentIntensity = useSettingsStore((s) => s.accentIntensity);
  const fontSize = useSettingsStore((s) => s.fontSize);
  const sessionOnly = useSettingsStore((s) => s.sessionOnly);
  const ready = useSettingsStore((s) => s.ready);

  const setDarkMode = useSettingsStore((s) => s.setDarkMode);
  const setPastelMode = useSettingsStore((s) => s.setPastelMode);
  const setFavoritesOnly = useSettingsStore((s) => s.setFavoritesOnly);
  const setCompactCards = useSettingsStore((s) => s.setCompactCards);
  const setShowEmojis = useSettingsStore((s) => s.setShowEmojis);
  const setEnableAnimations = useSettingsStore((s) => s.setEnableAnimations);
  const setAccentIntensity = useSettingsStore((s) => s.setAccentIntensity);
  const setFontSize = useSettingsStore((s) => s.setFontSize);
  const setSessionOnly = useSettingsStore((s) => s.setSessionOnly);

  const theme = useMemo(
    () => getTheme(darkMode, pastelMode, accentIntensity, fontSize),
    [darkMode, pastelMode, accentIntensity, fontSize],
  );

  return {
    theme, darkMode, setDarkMode, pastelMode, setPastelMode,
    favoritesOnly, setFavoritesOnly, compactCards, setCompactCards,
    showEmojis, setShowEmojis, enableAnimations, setEnableAnimations,
    accentIntensity, setAccentIntensity, fontSize, setFontSize,
    sessionOnly, setSessionOnly, ready,
  };
}
