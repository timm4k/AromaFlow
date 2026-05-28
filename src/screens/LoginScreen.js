import { ActivityIndicator, Animated, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import useLoginForm from "../hooks/useLoginForm";
import useEntranceAnimation from "../hooks/useEntranceAnimation";
import { spacing } from "../styles/spacing";
import { shadows } from "../styles/shadows";
import { styles } from "../styles/screens/loginStyles";

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { login } = useAuth();
  const { theme, enableAnimations } = useTheme();
  const {
    email,
    setEmail,
    password,
    setPassword,
    error,
    isSubmitting,
    handleSubmit,
  } = useLoginForm(login);

  const { animatedStyle } = useEntranceAnimation({
    enabled: enableAnimations,
    duration: 600,
  });

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.bg }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + spacing.lg,
            paddingBottom: insets.bottom + spacing.lg,
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={animatedStyle}>
          <View style={styles.headerSection}>
            <View
              style={[
                styles.logoCircle,
                { backgroundColor: theme.accentLight },
              ]}
            >
              <Text style={styles.logoEmoji}>🌿</Text>
            </View>

            <Text style={[styles.title, { color: theme.text }]}>
              AromaFlow
            </Text>

            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              Sign in to your aromatic world
            </Text>
          </View>

          <View
            style={[
              styles.card,
              { backgroundColor: theme.card, shadowColor: theme.shadow },
              shadows.modal,
            ]}
          >
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.text }]}>
                Email
              </Text>

              <View
                style={[
                  styles.inputWrapper,
                  {
                    backgroundColor: theme.bg,
                    borderColor: error ? theme.error : theme.border,
                  },
                ]}
              >
                <Text style={styles.inputIcon}>✉️</Text>

                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="tate@aromaflow.com"
                  placeholderTextColor={theme.textSecondary + "99"}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  editable={!isSubmitting}
                />

                {email.length > 0 && (
                  <TouchableOpacity
                    onPress={() => setEmail("")}
                    style={styles.clearBtn}
                    disabled={isSubmitting}
                  >
                    <Text
                      style={{ color: theme.textSecondary, fontSize: 16 }}
                    >
                      ✕
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.text }]}>
                Password
              </Text>

              <View
                style={[
                  styles.inputWrapper,
                  {
                    backgroundColor: theme.bg,
                    borderColor: error ? theme.error : theme.border,
                  },
                ]}
              >
                <Text style={styles.inputIcon}>🔒</Text>

                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter password"
                  placeholderTextColor={theme.textSecondary + "99"}
                  secureTextEntry
                  editable={!isSubmitting}
                />
              </View>
            </View>

            {error ? (
              <Text style={[styles.errorText, { color: theme.error }]}>
                {error}
              </Text>
            ) : null}

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleSubmit}
              disabled={isSubmitting}
              style={[
                styles.loginButton,
                {
                  backgroundColor: isSubmitting
                    ? theme.accentLight
                    : theme.accent,
                  shadowColor: theme.accent,
                },
                shadows.button,
              ]}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color={theme.accent} />
              ) : (
                <Text style={[styles.loginButtonText, { color: theme.white }]}>
                  Sign In
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
