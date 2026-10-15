import { Stack, useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../hooks/useTheme";
import { borderRadius, spacing } from "../styles/spacing";
import { getScentById } from "./scentCatalog";
import ScentDetailsScreen from "./ScentDetailsScreen";

interface ScentCatalogDetailsScreenProps {
  scentId?: string;
}

export default function ScentCatalogDetailsScreen({
  scentId,
}: ScentCatalogDetailsScreenProps) {
  const { theme } = useTheme();
  const router = useRouter();
  const scent = scentId ? getScentById(scentId) : undefined;

  if (scent) return <ScentDetailsScreen aromaId={scent.id} />;

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <Stack.Screen options={{ title: "Scent not found" }} />
      <Text style={[styles.title, { color: theme.text }]}>
        Scent not found
      </Text>
      <Text style={{ color: theme.textSecondary }}>
        No library entry matches this address
      </Text>
      <Pressable
        accessibilityRole="button"
        onPress={() =>
          router.canGoBack() ? router.back() : router.replace("/")
        }
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: theme.accent },
          pressed && styles.pressed,
        ]}
      >
        <Text style={{ color: theme.card, fontWeight: "700" }}>
          Back to the scent catalog
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
    gap: spacing.md,
  },
  title: { fontSize: 24, fontWeight: "700" },
  button: { padding: spacing.md, borderRadius: borderRadius.md },
  pressed: { opacity: 0.8 },
});
