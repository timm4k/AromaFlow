import { StyleSheet } from "react-native";
import { borderRadius, spacing } from "../spacing";
import { typography } from "../typography";

export const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: spacing.sm },
  backButton: { paddingVertical: 4, marginBottom: 8 },
  backText: { fontSize: 15, fontWeight: "600", letterSpacing: -0.2 },
  screenTitle: { ...typography.screenTitle },
  content: { padding: 20, paddingBottom: 120 },
  loader: { paddingVertical: 60 },
  emojiBox: {
    width: 84, height: 84, borderRadius: borderRadius.xl,
    justifyContent: "center", alignItems: "center",
    alignSelf: "center", marginBottom: 14,
  },
  emoji: { fontSize: 42 },
  title: { ...typography.screenTitle, textAlign: "center", marginBottom: 10 },
  badge: {
    alignSelf: "center", paddingHorizontal: 14, paddingVertical: 5,
    borderRadius: borderRadius.sm + 4, marginBottom: 14,
  },
  badgeText: { fontSize: 13, fontWeight: "700" },
  imageSection: { alignItems: "center", marginBottom: 16 },
  aromaImage: { width: "100%", height: 200, borderRadius: borderRadius.lg, marginBottom: 10 },
  imageActionBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: borderRadius.sm + 4 },
  imageActionText: { color: "#FFFFFF", fontSize: 13, fontWeight: "600" },
  attachButton: {
    borderWidth: 1.5, borderStyle: "dashed", borderRadius: borderRadius.md,
    paddingVertical: 14, alignItems: "center", justifyContent: "center", marginBottom: 16,
  },
  uploadingRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  attachText: { fontSize: 14, fontWeight: "700", letterSpacing: 0.2 },
  intensityRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 18 },
  intensityLabel: { fontSize: 13, fontWeight: "600", marginRight: 10 },
  dots: { flexDirection: "row" },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 5 },
  divider: { height: 1, marginBottom: 18 },
  description: { marginBottom: 18 },
  detailRow: { marginBottom: 14 },
  detailLabel: { ...typography.sectionLabel, marginBottom: 4 },
  detailValue: { fontSize: 15, fontWeight: "500", lineHeight: 21 },
  visibilityBadge: {
    alignSelf: "flex-start", paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: borderRadius.sm + 2, marginBottom: 14,
  },
  visibilityText: { fontSize: 12, fontWeight: "700", letterSpacing: 0.3 },
  ownerText: { textAlign: "center", fontWeight: "500", opacity: 0.6 },
});
