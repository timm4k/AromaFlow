import { ScrollView, StyleSheet, Text, View } from "react-native";
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
  showEmojis,
  setShowEmojis,
  enableAnimations,
  setEnableAnimations,
  fontSize,
  setFontSize,
}) {
  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.bg }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.screenTitle, { color: theme.text, fontSize: 28 * theme.fontScale }]}>
        Settings
      </Text>

      <Text style={[styles.screenSubtitle, { color: theme.textSecondary, fontSize: 14 * theme.fontScale }]}>
        Customize your experience
      </Text>

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.text, fontSize: 13 * theme.fontScale }]}>
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
          title="Accent Intensity"
          value={accentIntensity}
          onToggle={setAccentIntensity}
          type="options"
          options={["low", "medium", "high"]}
          theme={theme}
        />
      </View>

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.text, fontSize: 13 * theme.fontScale }]}>
          Accessibility
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
          title="Compact Cards"
          value={compactCards}
          onToggle={setCompactCards}
          type="switch"
          theme={theme}
        />

        <SettingItem
          title="Font Size"
          value={fontSize}
          onToggle={setFontSize}
          type="options"
          options={["small", "medium", "large"]}
          theme={theme}
        />
      </View>

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.text, fontSize: 13 * theme.fontScale }]}>
          Preferences
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

        <SettingItem
          title="Show Emojis"
          value={showEmojis}
          onToggle={setShowEmojis}
          type="switch"
          theme={theme}
        />
      </View>

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.text, fontSize: 13 * theme.fontScale }]}>
          Interface
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
          title="Enable Animations"
          value={enableAnimations}
          onToggle={setEnableAnimations}
          type="switch"
          theme={theme}
        />
      </View>

      <View style={styles.footer}>
        <Text style={[styles.footerTitle, { color: theme.accent, fontSize: 20 * theme.fontScale }]}>
          AromaFlow
        </Text>

        <Text style={[styles.footerSub, { color: theme.textSecondary, fontSize: 13 * theme.fontScale }]}>
          Interactive Aromatic Component System
        </Text>

        <Text style={[styles.footerVersion, { color: theme.textSecondary, fontSize: 12 * theme.fontScale }]}>
          v1.0.0
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    paddingBottom: 120,
  },

  screenTitle: {
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: -0.5,
    paddingHorizontal: 20,
    paddingTop: 4,
    marginBottom: 4,
  },

  screenSubtitle: {
    fontSize: 14,
    fontWeight: "500",
    paddingHorizontal: 20,
    marginBottom: 8,
    opacity: 0.7,
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
