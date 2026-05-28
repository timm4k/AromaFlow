import {
  ActivityIndicator, Animated, KeyboardAvoidingView, Platform,
  ScrollView, Text, TouchableOpacity, View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
import useAuthForm from "../hooks/useAuthForm";
import useEntranceAnimation from "../hooks/useEntranceAnimation";
import AuthInput from "../components/auth/AuthInput";
import AuthCard from "../components/auth/AuthCard";
import AuthFooter from "../components/auth/AuthFooter";
import { spacing } from "../styles/spacing";
import { shadows } from "../styles/shadows";
import { styles } from "../styles/screens/loginStyles";

export default function LoginScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { login } = useAuth();
  const { theme, enableAnimations } = useTheme();
  const {
    email, setEmail,
    password, setPassword,
    error, isSubmitting, handleSubmit,
  } = useAuthForm({ mode: "login", login });

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
            <View style={[styles.logoCircle, { backgroundColor: theme.accentLight }]}>
              <Text style={styles.logoEmoji}>🌿</Text>
            </View>

            <Text style={[styles.title, { color: theme.text }]}>
              AromaFlow
            </Text>

            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              Sign in to your aromatic world
            </Text>
          </View>

          <AuthCard theme={theme}>
            <AuthInput
              label="Email"
              icon="✉️"
              value={email}
              onChangeText={setEmail}
              placeholder="tate@aromaflow.com"
              error={error}
              theme={theme}
              editable={!isSubmitting}
              keyboardType="email-address"
            />

            <AuthInput
              label="Password"
              icon="🔒"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter password"
              error={error}
              theme={theme}
              editable={!isSubmitting}
              secureTextEntry
            />

            {error ? (
              <Text style={[styles.errorText, { color: theme.error }]}>{error}</Text>
            ) : null}

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleSubmit}
              disabled={isSubmitting}
              style={[styles.loginButton, { backgroundColor: isSubmitting ? theme.accentLight : theme.accent, shadowColor: theme.accent }, shadows.button]}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color={theme.accent} />
              ) : (
                <Text style={[styles.loginButtonText, { color: theme.white }]}>Sign In</Text>
              )}
            </TouchableOpacity>

            <AuthFooter
              theme={theme}
              label="Don't have an account?"
              actionLabel="Create One"
              onAction={() => navigation.navigate("Register")}
            />
          </AuthCard>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
