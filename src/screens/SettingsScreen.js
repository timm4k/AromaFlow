import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import ScreenHeader from "../components/ScreenHeader";
import SettingItem from "../components/SettingItem";
import SectionHeader from "../components/SectionHeader";
import SettingsSection from "../components/SettingsSection";
import { spacing } from "../styles/spacing";
import { shadows } from "../styles/shadows";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { currentUser, logout } = useAuth();
  const {
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
  } = useTheme();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.bg }]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 12 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <ScreenHeader
        title="Settings"
        subtitle="Customize your experience"
        theme={theme}
      />

      {currentUser && (
        <View
          style={[
            styles.profileCard,
            { backgroundColor: theme.card, shadowColor: theme.shadow },
            shadows.profile,
          ]}
        >
          <View
            style={[
              styles.avatarBox,
              { backgroundColor: theme.accentLight },
            ]}
          >
            <Text style={styles.avatar}>{currentUser.avatar}</Text>
          </View>

          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: theme.text }]}>
              Logged in as {currentUser.displayName}
            </Text>

            <Text
              style={[styles.profileUsername, { color: theme.textSecondary }]}
            >
              @{currentUser.username}
            </Text>
          </View>
        </View>
      )}

      <SectionHeader title="Appearance" theme={theme} />

      <SettingsSection theme={theme}>
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
      </SettingsSection>

      <SectionHeader title="Accessibility" theme={theme} />

      <SettingsSection theme={theme}>
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
      </SettingsSection>

      <SectionHeader title="Preferences" theme={theme} />

      <SettingsSection theme={theme}>
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
      </SettingsSection>

      <SectionHeader title="Interface" theme={theme} />

      <SettingsSection theme={theme}>
        <SettingItem
          title="Enable Animations"
          value={enableAnimations}
          onToggle={setEnableAnimations}
          type="switch"
          theme={theme}
        />
      </SettingsSection>

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={logout}
        style={[
          styles.logoutButton,
          { backgroundColor: theme.accentLight, borderColor: theme.accent },
        ]}
      >
        <Text style={[styles.logoutText, { color: theme.accent }]}>
          Log Out
        </Text>
      </TouchableOpacity>

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

  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    padding: 18,
    borderRadius: 22,
  },

  avatarBox: {
    width: 56,
    height: 56,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },

  avatar: {
    fontSize: 28,
  },

  profileInfo: {
    flex: 1,
  },

  profileName: {
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: -0.3,
    marginBottom: 2,
  },

  profileUsername: {
    fontSize: 13,
    fontWeight: "500",
    opacity: 0.7,
  },

  logoutButton: {
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
  },

  logoutText: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  footer: {
    alignItems: "center",
    paddingTop: spacing.xl,
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
    marginTop: spacing.xs,
    textAlign: "center",
  },

  footerVersion: {
    fontSize: 12,
    marginTop: 12,
    opacity: 0.6,
  },
});
