import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import ScreenHeader from "../components/ScreenHeader";
import SettingItem from "../components/SettingItem";
import SectionHeader from "../components/SectionHeader";
import SettingsSection from "../components/SettingsSection";
import { shadows } from "../styles/shadows";
import { styles } from "../styles/screens/settingsStyles";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { currentUser, logout } = useAuth();
  const { theme, darkMode, setDarkMode, pastelMode, setPastelMode,
    favoritesOnly, setFavoritesOnly, compactCards, setCompactCards,
    accentIntensity, setAccentIntensity, showEmojis, setShowEmojis,
    enableAnimations, setEnableAnimations, fontSize, setFontSize } = useTheme();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.bg }]}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 12 }]}
      showsVerticalScrollIndicator={false}
    >
      <ScreenHeader title="Settings" subtitle="Customize your experience" theme={theme} />

      {currentUser && (
        <View style={[styles.profileCard, { backgroundColor: theme.card, shadowColor: theme.shadow }, shadows.profile]}>
          <View style={[styles.avatarBox, { backgroundColor: theme.accentLight }]}>
            <Text style={styles.avatar}>{currentUser.displayName?.[0] || "🌿"}</Text>
          </View>

          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: theme.text }]}>
              Logged in as {currentUser.displayName}
            </Text>
            <Text style={[styles.profileUsername, { color: theme.textSecondary }]}>
              {currentUser.email || ""}
            </Text>
          </View>
        </View>
      )}

      <SectionHeader title="Appearance" theme={theme} />
      <SettingsSection theme={theme}>
        <SettingItem title="Dark Mode" value={darkMode} onToggle={setDarkMode} type="switch" theme={theme} />
        <SettingItem title="Pastel Mode" value={pastelMode} onToggle={setPastelMode} type="switch" theme={theme} />
        <SettingItem title="Accent Intensity" value={accentIntensity} onToggle={setAccentIntensity} type="options" options={["low", "medium", "high"]} theme={theme} />
      </SettingsSection>

      <SectionHeader title="Accessibility" theme={theme} />
      <SettingsSection theme={theme}>
        <SettingItem title="Compact Cards" value={compactCards} onToggle={setCompactCards} type="switch" theme={theme} />
        <SettingItem title="Font Size" value={fontSize} onToggle={setFontSize} type="options" options={["small", "medium", "large"]} theme={theme} />
      </SettingsSection>

      <SectionHeader title="Preferences" theme={theme} />
      <SettingsSection theme={theme}>
        <SettingItem title="Favorites Only" value={favoritesOnly} onToggle={setFavoritesOnly} type="switch" theme={theme} />
        <SettingItem title="Show Emojis" value={showEmojis} onToggle={setShowEmojis} type="switch" theme={theme} />
      </SettingsSection>

      <SectionHeader title="Interface" theme={theme} />
      <SettingsSection theme={theme}>
        <SettingItem title="Enable Animations" value={enableAnimations} onToggle={setEnableAnimations} type="switch" theme={theme} />
      </SettingsSection>

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={logout}
        style={[styles.logoutButton, { backgroundColor: theme.accentLight, borderColor: theme.accent }]}
      >
        <Text style={[styles.logoutText, { color: theme.accent }]}>Log Out</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={[styles.footerTitle, { color: theme.accent }]}>AromaFlow</Text>
        <Text style={[styles.footerSub, { color: theme.textSecondary }]}>Interactive Aromatic Component System</Text>
        <Text style={[styles.footerVersion, { color: theme.textSecondary }]}>v1.0.0</Text>
      </View>
    </ScrollView>
  );
}
