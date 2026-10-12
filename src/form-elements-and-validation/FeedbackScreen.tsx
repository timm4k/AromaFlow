import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ConfirmationModal from "../components/ConfirmationModal";
import { useTheme } from "../hooks/useTheme";
import { borderRadius, spacing } from "../styles/spacing";
import InputField from "./InputField";
import { RatingSelector } from "./RatingSelector";
import type { FeedbackFormData, FeedbackFormInput } from "./feedbackSchema";
import {
  feedbackDefaults,
  feedbackLimits,
  feedbackSchema,
  formatFeedback,
} from "./feedbackSchema";

const confirmationTitle = "Thank you for your feedback!";

export default function FeedbackScreen() {
  const { theme, enableAnimations } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [receipt, setReceipt] = useState<string | null>(null);
  const emailInput = useRef<TextInput>(null);
  const commentInput = useRef<TextInput>(null);
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<FeedbackFormInput, unknown, FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: feedbackDefaults,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  function closeReceipt() {
    setReceipt(null);
    reset();
  }

  function onSubmit(data: FeedbackFormData) {
    const message = formatFeedback(data);
    if (Platform.OS === "web") {
      setReceipt(message);
      return;
    }
    Alert.alert(
      confirmationTitle,
      message,
      [{ text: "Done", onPress: () => reset() }],
      { cancelable: false },
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.bg }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.scroll,
          {
            paddingTop: insets.top + spacing.md,
            paddingBottom: insets.bottom + spacing.lg,
          },
        ]}
      >
        <View style={styles.content}>
          <Pressable
            accessibilityRole="button"
            onPress={() =>
              router.canGoBack() ? router.back() : router.replace("/")
            }
            style={({ pressed }) => [styles.back, pressed && styles.pressed]}
          >
            <Text style={{ color: theme.accent }}>← Back to AromaFlow</Text>
          </Pressable>
          <Text
            style={[
              styles.title,
              { color: theme.text, fontSize: 28 * theme.fontScale },
            ]}
          >
            Leave a scent note
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Tell us how AromaFlow feels to you — choose a rating and share what
            could be better
          </Text>
          <View
            style={[
              styles.card,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
          >
            <Controller
              control={control}
              name="name"
              render={({ field, fieldState }) => (
                <InputField
                  label="Your name"
                  placeholder="Tate"
                  theme={theme}
                  ref={field.ref}
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  error={fieldState.error?.message}
                  onClear={() => field.onChange("")}
                  maxLength={feedbackLimits.name}
                  autoCapitalize="words"
                  returnKeyType="next"
                  onSubmitEditing={() => emailInput.current?.focus()}
                  submitBehavior="submit"
                  keyboardType="default"
                />
              )}
            />
            <Controller
              control={control}
              name="email"
              render={({ field, fieldState }) => (
                <InputField
                  label="Email address"
                  placeholder="tate@example.com"
                  theme={theme}
                  ref={(input) => {
                    field.ref(input);
                    emailInput.current = input;
                  }}
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  error={fieldState.error?.message}
                  onClear={() => field.onChange("")}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                  onSubmitEditing={() => commentInput.current?.focus()}
                  submitBehavior="submit"
                />
              )}
            />
            <Controller
              control={control}
              name="rating"
              render={({ field, fieldState }) => (
                <RatingSelector
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={fieldState.error?.message}
                  mutedColor={theme.textSecondary}
                />
              )}
            />
            <Controller
              control={control}
              name="comment"
              render={({ field, fieldState }) => (
                <InputField
                  label="Your feedback"
                  placeholder="Which scents or features did you enjoy?"
                  theme={theme}
                  ref={(input) => {
                    field.ref(input);
                    commentInput.current = input;
                  }}
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  error={fieldState.error?.message}
                  onClear={() => field.onChange("")}
                  maxLength={feedbackLimits.comment}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  keyboardType="default"
                />
              )}
            />
            <Controller
              control={control}
              name="isAnonymous"
              render={({ field }) => (
                <View style={styles.switchRow}>
                  <Text style={[styles.switchLabel, { color: theme.text }]}>
                    Anonymous feedback
                  </Text>
                  <Switch
                    accessibilityLabel="Anonymous feedback"
                    value={field.value ?? false}
                    onValueChange={field.onChange}
                    trackColor={{ true: theme.accent, false: theme.border }}
                  />
                </View>
              )}
            />
            <Pressable
              accessibilityRole="button"
              disabled={isSubmitting || receipt !== null}
              onPress={handleSubmit(onSubmit)}
              style={({ pressed }) => [
                styles.submit,
                { backgroundColor: theme.accent },
                pressed && styles.pressed,
                isSubmitting && styles.pressed,
              ]}
            >
              <Text style={[styles.submitText, { color: theme.white }]}>
                Send feedback
              </Text>
            </Pressable>
            <Text style={[styles.note, { color: theme.textSecondary }]}>
              This form shows a confirmation only — feedback is not uploaded or
              stored
            </Text>
          </View>
        </View>
      </ScrollView>
      {receipt !== null && (
        <ConfirmationModal
          visible
          title={confirmationTitle}
          message={receipt}
          confirmText="Done"
          onConfirm={closeReceipt}
          onCancel={closeReceipt}
          theme={theme}
          destructive={false}
          showCancel={false}
          enableAnimations={enableAnimations}
        />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: spacing.md },
  content: { width: "100%", maxWidth: 620, alignSelf: "center" },
  back: { alignSelf: "flex-start", paddingVertical: spacing.md },
  title: { fontWeight: "700", marginBottom: spacing.sm },
  subtitle: { fontSize: 15, lineHeight: 22, marginBottom: spacing.lg },
  card: { padding: spacing.lg, borderRadius: borderRadius.xl, borderWidth: 1 },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  switchLabel: { flex: 1, fontSize: 15, fontWeight: "600" },
  submit: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: "center",
  },
  submitText: { fontSize: 16, fontWeight: "700" },
  pressed: { opacity: 0.65 },
  note: { fontSize: 12, lineHeight: 18, marginTop: spacing.md },
});
