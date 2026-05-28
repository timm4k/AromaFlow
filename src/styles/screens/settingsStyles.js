import { StyleSheet } from "react-native";
import { spacing } from "../spacing";

export const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingBottom: 120 },
  profileCard: {
    flexDirection: "row", alignItems: "center",
    marginHorizontal: spacing.md, marginBottom: spacing.sm,
    padding: 18, borderRadius: 22,
  },
  avatarBox: { width: 56, height: 56, borderRadius: 18, justifyContent: "center", alignItems: "center", marginRight: spacing.md },
  avatar: { fontSize: 28 },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 17, fontWeight: "700", letterSpacing: -0.3, marginBottom: 2 },
  profileUsername: { fontSize: 13, fontWeight: "500", opacity: 0.7 },
  logoutButton: {
    marginHorizontal: spacing.md, marginTop: spacing.lg,
    paddingVertical: spacing.md, borderRadius: 20,
    alignItems: "center", justifyContent: "center", borderWidth: 1.5,
  },
  logoutText: { fontSize: 16, fontWeight: "700", letterSpacing: 0.3 },
  footer: { alignItems: "center", paddingTop: spacing.xl, paddingBottom: 40, paddingHorizontal: 20 },
  footerTitle: { fontSize: 20, fontWeight: "700", letterSpacing: -0.3 },
  footerSub: { fontSize: 13, marginTop: spacing.xs, textAlign: "center" },
  footerVersion: { fontSize: 12, marginTop: 12, opacity: 0.6 },
});
