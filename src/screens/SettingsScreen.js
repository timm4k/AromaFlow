import { StyleSheet, Text, View } from "react-native";
import SettingItem from "../components/SettingItem";

export default function SettingsScreen({
  theme,
  darkMode,
  setDarkMode,
  pastelMode,
  setPastelMode,
  favoritesOnly,
  setFavoritesOnly,
  compactCards,
  setCompactCards,
  accentIntensity,
  setAccentIntensity,
}) {
  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Appearance
        </Text>
      </View>

      <View
        style={[
          styles.section,
          {
            backgroundColor: theme.card,
            shadowColor: theme.shadow,
          },
        ]}
      >
        <SettingItem
          title="Dark Mode"
          value={darkMode}
          onToggle={setDarkMode}
          type="switch"
          theme={theme}
        />

        <SettingItem
          title="Pastel Mode"
          value={pastelMode}
          onToggle={setPastelMode}
          type="switch"
          theme={theme}
        />

        <SettingItem
          title="Compact Cards"
          value={compactCards}
          onToggle={setCompactCards}
          type="switch"
          theme={theme}
        />

        <SettingItem
          title="Accent Intensity"
          value={accentIntensity}
          onToggle={setAccentIntensity}
          type="options"
          options={["low", "medium", "high"]}
          theme={theme}
        />
      </View>

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          General
        </Text>
      </View>

      <View
        style={[
          styles.section,
          {
            backgroundColor: theme.card,
            shadowColor: theme.shadow,
          },
        ]}
      >
        <SettingItem
          title="Favorites Only"
          value={favoritesOnly}
          onToggle={setFavoritesOnly}
          type="switch"
          theme={theme}
        />
      </View>

      <View style={styles.footer}>
        <Text style={[styles.footerTitle, { color: theme.accent }]}>
          AromaFlow
        </Text>

        <Text style={[styles.footerSub, { color: theme.textSecondary }]}>
          Interactive Aromatic Component System
        </Text>

        <Text style={[styles.footerVersion, { color: theme.textSecondary }]}>
          v1.0.0
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 20,
  },

  sectionHeader: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 8,
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },

  section: {
    marginHorizontal: 16,
    borderRadius: 18,

    shadowOffset: {
      width: 0,
      height: 3,
    },

    shadowOpacity: 0.08,
    shadowRadius: 10,

    elevation: 3,
  },

  footer: {
    alignItems: "center",
    paddingTop: 32,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },

  footerTitle: {
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: -0.3,
  },

  footerSub: {
    fontSize: 13,
    marginTop: 4,
    textAlign: "center",
  },

  footerVersion: {
    fontSize: 12,
    marginTop: 12,
    opacity: 0.6,
  },
});
