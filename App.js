import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import ErrorBoundary from "./src/components/ErrorBoundary";
import BottomNavigation from "./src/components/BottomNavigation";
import AddAromaScreen from "./src/screens/AddAromaScreen";
import AromasScreen from "./src/screens/AromasScreen";
import MyAromasScreen from "./src/screens/MyAromasScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import { aromas } from "./src/data/aromas";
import { getTheme } from "./src/styles/colors";

const STORAGE_KEYS = {
  CUSTOM_AROMAS: "@aromaflow/customAromas",
  FAVORITES: "@aromaflow/favorites",
  SETTINGS: "@aromaflow/settings",
};

let customIdCounter = 0;

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState("aromas");
  const [darkMode, setDarkMode] = useState(false);
  const [pastelMode, setPastelMode] = useState(true);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [compactCards, setCompactCards] = useState(false);
  const [showEmojis, setShowEmojis] = useState(true);
  const [enableAnimations, setEnableAnimations] = useState(true);
  const [accentIntensity, setAccentIntensity] = useState("medium");
  const [fontSize, setFontSize] = useState("medium");
  const [favorites, setFavorites] = useState([]);
  const [customAromas, setCustomAromas] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [savedAromas, savedFavorites, savedSettings] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.CUSTOM_AROMAS),
          AsyncStorage.getItem(STORAGE_KEYS.FAVORITES),
          AsyncStorage.getItem(STORAGE_KEYS.SETTINGS),
        ]);

        if (savedAromas) {
          const parsed = JSON.parse(savedAromas);
          setCustomAromas(parsed);
          parsed.forEach((a) => {
            const m = a.id.match(/custom_(\d+)_/);
            if (m) customIdCounter = Math.max(customIdCounter, parseInt(m[1], 10) + 1);
          });
        }
        if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
        if (savedSettings) {
          const s = JSON.parse(savedSettings);
          if (s.darkMode !== undefined) setDarkMode(s.darkMode);
          if (s.pastelMode !== undefined) setPastelMode(s.pastelMode);
          if (s.favoritesOnly !== undefined) setFavoritesOnly(s.favoritesOnly);
          if (s.compactCards !== undefined) setCompactCards(s.compactCards);
          if (s.showEmojis !== undefined) setShowEmojis(s.showEmojis);
          if (s.enableAnimations !== undefined) setEnableAnimations(s.enableAnimations);
          if (s.accentIntensity !== undefined) setAccentIntensity(s.accentIntensity);
          if (s.fontSize !== undefined) setFontSize(s.fontSize);
        }
      } catch (e) {
        console.warn("Failed to load data", e);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!ready) return;
    AsyncStorage.setItem(STORAGE_KEYS.CUSTOM_AROMAS, JSON.stringify(customAromas)).catch(() => {});
  }, [customAromas, ready]);

  useEffect(() => {
    if (!ready) return;
    AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites)).catch(() => {});
  }, [favorites, ready]);

  useEffect(() => {
    if (!ready) return;
    const settings = { darkMode, pastelMode, favoritesOnly, compactCards, showEmojis, enableAnimations, accentIntensity, fontSize };
    AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings)).catch(() => {});
  }, [darkMode, pastelMode, favoritesOnly, compactCards, showEmojis, enableAnimations, accentIntensity, fontSize, ready]);

  const theme = getTheme(darkMode, pastelMode, accentIntensity, fontSize);

  const allNames = useMemo(() => {
    const builtinNames = aromas.map((a) => a.title);
    const customNames = customAromas.map((a) => a.title);
    return [...builtinNames, ...customNames];
  }, [customAromas]);

  const onToggleFavorite = useCallback((id) => {
    setFavorites((prev) => {
      if (prev.includes(id)) return prev.filter((item) => item !== id);
      return [...prev, id];
    });
  }, []);

  const onAddAroma = useCallback((aroma) => {
    customIdCounter += 1;
    const newAroma = {
      ...aroma,
      id: `custom_${customIdCounter}_${Date.now()}`,
      isCustom: true,
      createdAt: Date.now(),
    };
    setCustomAromas((prev) => [newAroma, ...prev]);
  }, []);

  const onDeleteAroma = useCallback((id) => {
    setCustomAromas((prev) => prev.filter((a) => a.id !== id));
    setFavorites((prev) => prev.filter((fid) => fid !== id));
  }, []);

  const renderScreen = () => {
    switch (currentScreen) {
      case "aromas":
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
      case "myaromas":
        return (
          <MyAromasScreen
            theme={theme}
            customAromas={customAromas}
            favorites={favorites}
            onToggleFavorite={onToggleFavorite}
            onDeleteAroma={onDeleteAroma}
            enableAnimations={enableAnimations}
          />
        );
      case "add":
        return (
          <AddAromaScreen
            theme={theme}
            onAdd={onAddAroma}
            existingNames={allNames}
            enableAnimations={enableAnimations}
          />
        );
      case "settings":
        return (
          <SettingsScreen
            theme={theme}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            pastelMode={pastelMode}
            setPastelMode={setPastelMode}
            favoritesOnly={favoritesOnly}
            setFavoritesOnly={setFavoritesOnly}
            compactCards={compactCards}
            setCompactCards={setCompactCards}
            accentIntensity={accentIntensity}
            setAccentIntensity={setAccentIntensity}
            showEmojis={showEmojis}
            setShowEmojis={setShowEmojis}
            enableAnimations={enableAnimations}
            setEnableAnimations={setEnableAnimations}
            fontSize={fontSize}
            setFontSize={setFontSize}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.bg }]}>
      <StatusBar
        barStyle={darkMode ? "light-content" : "dark-content"}
        backgroundColor={theme.bg}
      />

      <View style={[styles.container, { backgroundColor: theme.bg }]}>
        <View
          style={[
            styles.header,
            { paddingTop: Platform.OS === "web" ? 48 : 32 },
          ]}
        >
          <Text style={[styles.title, { color: theme.text, fontSize: 28 * theme.fontScale }]}>AromaFlow</Text>

          <Text style={[styles.subtitle, { color: theme.textSecondary, fontSize: 14 * theme.fontScale }]}>
            Interactive Aromatic Components
          </Text>
        </View>

        <View style={styles.screenContainer}>{renderScreen()}</View>

        <BottomNavigation
          activeTab={currentScreen}
          onTabChange={setCurrentScreen}
          theme={theme}
          enableAnimations={enableAnimations}
        />
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  container: {
    flex: 1,
  },

  header: {
    paddingHorizontal: 24,
    paddingBottom: 8,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: -0.5,
  },

  subtitle: {
    fontSize: 14,
    marginTop: 4,
    letterSpacing: 0.2,
  },

  screenContainer: {
    flex: 1,
  },
});
