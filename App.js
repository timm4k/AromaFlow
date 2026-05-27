import { useCallback, useState } from "react";
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

import ErrorBoundary from "./src/components/ErrorBoundary";
import ScreenButton from "./src/components/ScreenButton";
import AromasScreen from "./src/screens/AromasScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import { getTheme } from "./src/styles/colors";

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState("aromas");
  const [darkMode, setDarkMode] = useState(false);
  const [pastelMode, setPastelMode] = useState(true);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [compactCards, setCompactCards] = useState(false);
  const [accentIntensity, setAccentIntensity] = useState("medium");
  const [favorites, setFavorites] = useState([]);

  const theme = getTheme(darkMode, pastelMode, accentIntensity);

  const onToggleFavorite = useCallback((id) => {
    setFavorites((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }

      return [...prev, id];
    });
  }, []);

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
            {
              paddingTop: Platform.OS === "web" ? 40 : 20,
            },
          ]}
        >
          <Text style={[styles.title, { color: theme.text }]}>AromaFlow</Text>

          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Interactive Aromatic Components
          </Text>
        </View>

        <View style={styles.nav}>
          <View style={styles.navItem}>
            <ScreenButton
              label="Aromas"
              active={currentScreen === "aromas"}
              onPress={() => setCurrentScreen("aromas")}
              theme={theme}
            />
          </View>

          <View style={styles.navItem}>
            <ScreenButton
              label="Settings"
              active={currentScreen === "settings"}
              onPress={() => setCurrentScreen("settings")}
              theme={theme}
            />
          </View>
        </View>

        {currentScreen === "aromas" ? (
          <AromasScreen
            theme={theme}
            compactCards={compactCards}
            favorites={favorites}
            favoritesOnly={favoritesOnly}
            onToggleFavorite={onToggleFavorite}
          />
        ) : (
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
          />
        )}
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

  nav: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },

  navItem: {
    flex: 1,
    marginHorizontal: 5,
  },
});
