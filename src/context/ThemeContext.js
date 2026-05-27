import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { getTheme } from "../styles/colors";
import { loadSettings, saveSettings } from "../storage/settingsStorage";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false);
  const [pastelMode, setPastelMode] = useState(true);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [compactCards, setCompactCards] = useState(false);
  const [showEmojis, setShowEmojis] = useState(true);
  const [enableAnimations, setEnableAnimations] = useState(true);
  const [accentIntensity, setAccentIntensity] = useState("medium");
  const [fontSize, setFontSize] = useState("medium");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const s = await loadSettings();

        if (!s) {
          setReady(true);

          return;
        }

        if (s.darkMode !== undefined) setDarkMode(s.darkMode);
        if (s.pastelMode !== undefined) setPastelMode(s.pastelMode);
        if (s.favoritesOnly !== undefined) setFavoritesOnly(s.favoritesOnly);
        if (s.compactCards !== undefined) setCompactCards(s.compactCards);
        if (s.showEmojis !== undefined) setShowEmojis(s.showEmojis);
        if (s.enableAnimations !== undefined) {
          setEnableAnimations(s.enableAnimations);
        }
        if (s.accentIntensity !== undefined) {
          setAccentIntensity(s.accentIntensity);
        }
        if (s.fontSize !== undefined) setFontSize(s.fontSize);
      } catch (e) {
        console.warn("Failed to load settings", e);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!ready) return;

    const settings = {
      darkMode,
      pastelMode,
      favoritesOnly,
      compactCards,
      showEmojis,
      enableAnimations,
      accentIntensity,
      fontSize,
    };

    saveSettings(settings);
  }, [
    darkMode,
    pastelMode,
    favoritesOnly,
    compactCards,
    showEmojis,
    enableAnimations,
    accentIntensity,
    fontSize,
    ready,
  ]);

  const theme = getTheme(darkMode, pastelMode, accentIntensity, fontSize);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        darkMode,
        setDarkMode,
        pastelMode,
        setPastelMode,
        favoritesOnly,
        setFavoritesOnly,
        compactCards,
        setCompactCards,
        showEmojis,
        setShowEmojis,
        enableAnimations,
        setEnableAnimations,
        accentIntensity,
        setAccentIntensity,
        fontSize,
        setFontSize,
        ready,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);

  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return ctx;
}
