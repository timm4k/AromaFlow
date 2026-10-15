import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../hooks/useTheme";
import { borderRadius, headerPadding, spacing } from "../styles/spacing";
import { shadows } from "../styles/shadows";
import { getSavedPhoto } from "./mediaService";

interface ProfileShortcutProps {
  profileId: string;
  displayName?: string | null;
  email?: string | null;
}

export function ProfileShortcut({
  profileId,
  displayName,
  email,
}: ProfileShortcutProps) {
  const { theme } = useTheme();
  const router = useRouter();
  const [photo, setPhoto] = useState({
    uri: null as string | null,
    failed: false,
  });
  useFocusEffect(
    useCallback(() => {
      let active = true;
      async function loadPhoto() {
        try {
          const uri = await getSavedPhoto(profileId);
          if (active) setPhoto({ uri, failed: false });
        } catch {
          if (active) setPhoto({ uri: null, failed: true });
        }
      }
      void loadPhoto();
      return () => {
        active = false;
      };
    }, [profileId]),
  );
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Manage your local profile photo"
      onPress={() => router.push("/profile")}
      style={({ pressed }) => [
        styles.card,
        shadows.profile,
        { backgroundColor: theme.card, shadowColor: theme.shadow },
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.avatar, { backgroundColor: theme.accentLight }]}>
        {photo.uri ? (
          <Image
            accessibilityLabel="Your locally saved avatar"
            source={{ uri: photo.uri }}
            style={styles.photo}
            onError={() => setPhoto({ uri: null, failed: true })}
          />
        ) : (
          <Text style={{ fontSize: 28, color: theme.accent }}>
            {displayName?.[0]?.toUpperCase() || "◉"}
          </Text>
        )}
      </View>
      <View style={styles.info}>
        <Text style={[styles.name, { color: theme.text }]}>
          {displayName || "Your profile"}
        </Text>
        <Text style={{ color: theme.textSecondary, fontSize: 13 }}>
          {email}
        </Text>
        <Text style={{ color: theme.accent, marginTop: spacing.xs }}>
          {photo.failed
            ? "Avatar unavailable — open profile →"
            : "Manage local avatar →"}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: headerPadding.horizontal,
    marginBottom: spacing.sm,
    padding: spacing.md,
    borderRadius: borderRadius.xl,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
    overflow: "hidden",
  },
  photo: { width: "100%", height: "100%" },
  info: { flex: 1 },
  name: { fontSize: 17, fontWeight: "700", marginBottom: spacing.xs },
  pressed: { opacity: 0.8 },
});
