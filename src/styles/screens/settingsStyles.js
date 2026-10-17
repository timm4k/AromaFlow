import { StyleSheet } from "react-native";
import { spacing } from "../spacing";

export const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingBottom: 120 },
  calendarButton: {
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    paddingVertical: 14,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
  },
  calendarButtonText: { fontSize: 15, fontWeight: "700", letterSpacing: 0.2 },
  buttonPressed: { opacity: 0.7 },
  calendarStatus: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
    marginTop: spacing.xs,
    opacity: 0.7,
  },
  logoutButton: {
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
  },
  logoutText: { fontSize: 16, fontWeight: "700", letterSpacing: 0.3 },
  sessionHint: {
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 12,
    opacity: 0.7,
  },
  footer: {
    alignItems: "center",
    paddingTop: spacing.xl,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  footerTitle: { fontSize: 20, fontWeight: "700", letterSpacing: -0.3 },
  footerSub: { fontSize: 13, marginTop: spacing.xs, textAlign: "center" },
  footerVersion: { fontSize: 12, marginTop: 12, opacity: 0.6 },
});
