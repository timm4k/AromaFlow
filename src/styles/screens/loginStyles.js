import { StyleSheet } from "react-native";
import { borderRadius, spacing } from "../spacing";

export const styles = StyleSheet.create({
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
    minHeight: 52,
  },

  loginButtonText: {
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
