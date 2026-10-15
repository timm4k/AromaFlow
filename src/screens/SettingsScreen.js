import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ScreenHeader from "../components/ScreenHeader";
import SectionHeader from "../components/SectionHeader";
import SettingItem from "../components/SettingItem";
import SettingsSection from "../components/SettingsSection";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
import { createCalendarReminder } from "../services/calendarService";
import { styles } from "../styles/screens/settingsStyles";
import { ProfileShortcut } from "../camera-media/ProfileShortcut";

export default function SettingsScreen() {
  const router = useRouter();
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
    sessionOnly,
    setSessionOnly,
  } = useTheme();
  const [calendarInstalled, setCalendarInstalled] = useState(null);
  const [checkingCalendar, setCheckingCalendar] = useState(false);

  const handleCalendar = useCallback(async () => {
    setCheckingCalendar(true);

    try {
      const result = await createCalendarReminder({
        title: "AromaFlow: Explore Your Scents",
        notes: "Take a moment to explore and discover new aromas in AromaFlow",
      });

      if (result.status === "unsupported") {
        Alert.alert(
          "Calendar unavailable in Expo Go",
          "Calendar reminders require a development build of AromaFlow",
        );
        setCalendarInstalled(false);
        return;
      }

      if (result.status === "permission-denied") {
        Alert.alert(
          "Permission Denied",
          "Calendar access is needed to set reminders.",
        );
        setCalendarInstalled(false);
        return;
      }

      if (result.status === "no-calendar") {
        Alert.alert(
          "No Calendar Found",
          "Could not find a writable calendar on this device.",
        );
        setCalendarInstalled(false);
        return;
      }

      if (result.status === "created") {
        Alert.alert(
          "Reminder Added",
          "A 30-minute aroma exploration session has been added to your calendar.",
        );
        setCalendarInstalled(true);
      }
    } catch {
      Alert.alert(
        "Calendar Unavailable",
        "Could not access calendar. Make sure expo-calendar is installed.",
      );
      setCalendarInstalled(false);
    } finally {
      setCheckingCalendar(false);
    }
  }, []);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.bg }]}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 12 }]}
      showsVerticalScrollIndicator={false}
    >
      <ScreenHeader
        title="Settings"
        subtitle="Customize your experience"
        theme={theme}
      />

      {currentUser && (
        <ProfileShortcut
          key={currentUser.uid}
          profileId={currentUser.uid}
          displayName={currentUser.displayName}
          email={currentUser.email}
        />
      )}

      <SectionHeader title="Feedback" theme={theme} />
      <SettingsSection theme={theme}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.push("/feedback")}
          style={[
            styles.calendarButton,
            { backgroundColor: theme.accentLight, borderColor: theme.accent },
          ]}
        >
          <Text style={[styles.calendarButtonText, { color: theme.accent }]}>
            Leave feedback
          </Text>
        </TouchableOpacity>
      </SettingsSection>
      <SectionHeader title="Calendar" theme={theme} />
      <SettingsSection theme={theme}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleCalendar}
          disabled={checkingCalendar}
          style={[
            styles.calendarButton,
            { backgroundColor: theme.accentLight, borderColor: theme.accent },
          ]}
        >
          <Text style={[styles.calendarButtonText, { color: theme.accent }]}>
            {checkingCalendar ? "Adding..." : "📅 Add Reminder to Calendar"}
          </Text>
        </TouchableOpacity>

        {calendarInstalled !== null && (
          <Text
            style={[
              styles.calendarStatus,
              { color: calendarInstalled ? theme.accent : theme.error },
            ]}
          >
            {calendarInstalled
              ? "✓ Calendar ready"
              : "✗ Calendar not available"}
          </Text>
        )}
      </SettingsSection>

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
        <SettingItem
          title="Session Only"
          value={sessionOnly}
          onToggle={setSessionOnly}
          type="switch"
          theme={theme}
        />

        {sessionOnly && (
          <Text style={[styles.sessionHint, { color: theme.textSecondary }]}>
            Settings and favorites won't be saved after you close the app
          </Text>
        )}
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
