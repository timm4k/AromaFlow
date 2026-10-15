import type { User } from "firebase/auth";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { InputField } from "../form-elements-and-validation/InputField";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
import { borderRadius, spacing } from "../styles/spacing";
import { useProfilePhoto } from "./useProfilePhoto";

const AVATAR_SIZE = 140;

export default function ProfileScreen() {
  const { currentUser }: { currentUser: User | null } = useAuth();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [name, setName] = useState(currentUser?.displayName ?? "");
  const [specialty, setSpecialty] = useState("Fragrance enthusiast");
  const { photoUri, isLoading, pickFromGallery, takeWithCamera, removePhoto } =
    useProfilePhoto(currentUser?.uid);
  const disabled = isLoading || Platform.OS === "web";

  const showPhotoActions = () =>
    Alert.alert("Profile photo", "Choose how to update your local avatar", [
      { text: "Gallery", onPress: () => void pickFromGallery() },
      { text: "Camera", onPress: () => void takeWithCamera() },
      { text: "Cancel", style: "cancel" },
    ]);

  return (
    <ScrollView
      style={{ backgroundColor: theme.bg }}
      contentContainerStyle={[
        styles.container,
        { paddingBottom: insets.bottom + spacing.lg },
      ]}
      keyboardShouldPersistTaps="handled"
    >
      <View
        style={[
          styles.card,
          { backgroundColor: theme.card, borderColor: theme.border },
        ]}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Change profile photo"
          accessibilityState={{ disabled, busy: isLoading }}
          disabled={disabled}
          onPress={showPhotoActions}
          style={({ pressed }) => [
            styles.avatar,
            { backgroundColor: theme.accentLight, borderColor: theme.accent },
            pressed && styles.pressed,
          ]}
        >
          {isLoading ? (
            <ActivityIndicator
              accessibilityLabel="Processing profile photo"
              size="large"
              color={theme.accent}
            />
          ) : photoUri ? (
            <Image
              accessibilityLabel="Your locally saved avatar"
              source={{ uri: photoUri }}
              style={styles.photo}
            />
          ) : (
            <Text style={{ color: theme.accent, fontSize: 42 }}>
              {name[0]?.toUpperCase() || "◉"}
            </Text>
          )}
        </Pressable>
        <Text style={[styles.title, { color: theme.text }]}>
          Your AromaFlow profile
        </Text>
        <View style={styles.fields}>
          <InputField
            label="Name"
            value={name}
            onChangeText={setName}
            theme={theme}
            autoCapitalize="words"
          />
          <InputField
            label="Specialty"
            value={specialty}
            onChangeText={setSpecialty}
            theme={theme}
          />
        </View>
        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            disabled={disabled}
            onPress={() => void pickFromGallery()}
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: theme.accent },
              pressed && styles.pressed,
              disabled && styles.disabled,
            ]}
          >
            <Text style={{ color: theme.white, fontWeight: "600" }}>
              Gallery
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            disabled={disabled}
            onPress={() => void takeWithCamera()}
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: theme.accentLight },
              pressed && styles.pressed,
              disabled && styles.disabled,
            ]}
          >
            <Text style={{ color: theme.accent, fontWeight: "600" }}>
              Camera
            </Text>
          </Pressable>
        </View>
        {photoUri && (
          <Pressable
            accessibilityRole="button"
            disabled={disabled}
            onPress={() => void removePhoto()}
            style={({ pressed }) => [
              styles.remove,
              pressed && styles.pressed,
              disabled && styles.disabled,
            ]}
          >
            <Text style={{ color: theme.error, fontWeight: "600" }}>
              Remove photo
            </Text>
          </Pressable>
        )}
      </View>
      <Text style={[styles.note, { color: theme.textSecondary }]}>
        {Platform.OS === "web"
          ? "Use Expo Go on Android or iOS for the camera and persistent local avatar"
          : "Photos are resized to 500px and saved as JPEG at 70% quality on this device — no upload"}
      </Text>
      <Text style={[styles.note, { color: theme.textSecondary }]}>
        Name and specialty are preview fields — your account details stay
        unchanged
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.lg, alignItems: "center", gap: spacing.md },
  card: {
    width: "100%",
    maxWidth: 560,
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    alignItems: "center",
    gap: spacing.md,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    borderWidth: 3,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  photo: { width: "100%", height: "100%" },
  title: { fontSize: 22, fontWeight: "700", textAlign: "center" },
  fields: { width: "100%", gap: spacing.sm },
  actions: { width: "100%", flexDirection: "row", gap: spacing.sm },
  button: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: "center",
  },
  remove: { padding: spacing.sm },
  note: { maxWidth: 560, textAlign: "center", lineHeight: 20, fontSize: 13 },
  pressed: { opacity: 0.8 },
  disabled: { opacity: 0.5 },
});
