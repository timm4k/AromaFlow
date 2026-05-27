import { useEffect, useRef, useState } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { spacing, borderRadius } from "../styles/spacing";
import { shadows } from "../styles/shadows";

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { login } = useAuth();
  const { theme, enableAnimations } = useTheme();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    const dur = enableAnimations ? 600 : 0;

    Animated.parallel([
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: dur,
        useNativeDriver: true,
      }),
      Animated.timing(slideUp, {
        toValue: 0,
        duration: dur,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  async function handleLogin() {
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password");
      return;
    }

    const ok = await login(username.trim().toLowerCase(), password);

    if (!ok) {
      setError("Invalid username or password");
    }
  }

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
        <Animated.View
          style={[
            styles.content,
            { opacity: fadeIn, transform: [{ translateY: slideUp }] },
          ]}
        >
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
              styles.card,
              { backgroundColor: theme.card, shadowColor: theme.shadow },
              shadows.modal,
            ]}
          >
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.text }]}>
                Username
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
                <Text style={styles.inputIcon}>👤</Text>

                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  value={username}
                  onChangeText={setUsername}
                  placeholder="Enter username"
                  placeholderTextColor={theme.textSecondary + "99"}
                  autoCapitalize="none"
                  autoCorrect={false}
                />

                {username.length > 0 && (
                  <TouchableOpacity
                    onPress={() => setUsername("")}
                    style={styles.clearBtn}
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
                />
              </View>
            </View>

            {error ? (
              <Text style={[styles.errorText, { color: theme.error }]}>{error}</Text>
            ) : null}

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleLogin}
              style={[
                styles.loginButton,
                {
                  backgroundColor: theme.accent,
                  shadowColor: theme.accent,
                },
                shadows.button,
              ]}
            >
              <Text style={[styles.loginButtonText, { color: theme.white }]}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: spacing.lg,
  },

  content: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },

  headerSection: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },

  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.xxl,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.md,
  },

  logoEmoji: {
    fontSize: 38,
  },

  title: {
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: -0.5,
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 15,
    fontWeight: "500",
    opacity: 0.7,
    textAlign: "center",
  },

  card: {
    borderRadius: borderRadius.xxl,
    padding: spacing.lg,
  },

  inputGroup: {
    marginBottom: 18,
  },

  label: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: spacing.sm,
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    paddingHorizontal: spacing.md,
    minHeight: 52,
  },

  inputIcon: {
    fontSize: 16,
    marginRight: 10,
    opacity: 0.6,
  },

  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    paddingVertical: 12,
  },

  clearBtn: {
    paddingLeft: spacing.sm,
    paddingVertical: spacing.xs,
  },

  errorText: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: spacing.md,
    textAlign: "center",
  },

  loginButton: {
    paddingVertical: spacing.md,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  loginButtonText: {
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
