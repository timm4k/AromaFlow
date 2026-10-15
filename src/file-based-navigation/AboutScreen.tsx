import Constants from "expo-constants";
import { Link } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../hooks/useTheme";
import { borderRadius, spacing } from "../styles/spacing";

export default function AboutScreen() {
  const { theme } = useTheme();
  return (
    <ScrollView
      style={{ backgroundColor: theme.bg }}
      contentContainerStyle={styles.content}
    >
      <Text
        style={{
          color: theme.text,
          fontSize: 28 * theme.fontScale,
          fontWeight: "800",
        }}
      >
        AromaFlow
      </Text>
      <Text
        style={{ color: theme.textSecondary, fontSize: 16, lineHeight: 24 }}
      >
        Explore scent families and origins, keep your favorite notes, and create
        your own aromatic blends
      </Text>
      <View
        style={[
          styles.card,
          { backgroundColor: theme.card, borderColor: theme.border },
        ]}
      >
        <Text style={{ color: theme.text, fontWeight: "700" }}>
          Version {Constants.expoConfig?.version ?? "—"}
        </Text>
        <Text style={{ color: theme.textSecondary, lineHeight: 22 }}>
          React Native · Expo Router · TypeScript
        </Text>
        <Text style={{ color: theme.textSecondary, lineHeight: 22 }}>
          The library contains built-in scent notes — Community shows shared
          creations, while My aromas belongs to your account
        </Text>
        <Text style={{ color: theme.textSecondary, lineHeight: 22 }}>
          Catalog ratings are sample discovery scores, not collected user
          reviews — ingredient photos come from Wikimedia Commons
        </Text>
      </View>
      <Link href="/" asChild>
        <Pressable
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: theme.accent },
            pressed && styles.pressed,
          ]}
        >
          <Text style={{ color: theme.card, fontWeight: "700" }}>
            Explore the scent library
          </Text>
        </Pressable>
      </Link>
      <Link href="/feedback" asChild>
        <Pressable
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.button,
            { borderWidth: 1, borderColor: theme.border },
            pressed && styles.pressed,
          ]}
        >
          <Text style={{ color: theme.accent, fontWeight: "700" }}>
            Leave a scent note
          </Text>
        </Pressable>
      </Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xl },
  card: {
    padding: spacing.md,
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    gap: spacing.md,
  },
  button: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: "center",
  },
  pressed: { opacity: 0.8 },
});
