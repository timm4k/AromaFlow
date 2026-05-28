import { StyleSheet } from "react-native";
import { borderRadius, spacing } from "../spacing";

export const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { paddingTop: spacing.xs, paddingBottom: 120 },

  card: {
    flexDirection: "row", borderRadius: borderRadius.xxl,
    padding: 14, marginHorizontal: 14, marginVertical: 6,
  },
  emojiBox: { width: 58, height: 58, borderRadius: borderRadius.md, justifyContent: "center", alignItems: "center", marginRight: 14 },
  emoji: { fontSize: 28 },
  content: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 5 },
  titleRow: { flex: 1, flexDirection: "row", alignItems: "center", gap: 8, marginRight: 8 },
  title: { fontSize: 17, fontWeight: "700", letterSpacing: -0.3, flexShrink: 1 },
  customBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: borderRadius.sm, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 2 },
  customBadgeText: { fontSize: 9, fontWeight: "800", letterSpacing: 0.5 },
  favoriteButton: { paddingLeft: 8, paddingVertical: 2 },
  favorite: { fontSize: 18, opacity: 0.5 },
  favoriteActive: { opacity: 1 },
  badgeRow: { flexDirection: "row", marginBottom: 5, gap: 6 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: borderRadius.sm },
  badgeText: { fontSize: 11, fontWeight: "700", letterSpacing: 0.3 },
  visibilityToggle: { flexDirection: "row", alignItems: "center", paddingHorizontal: 8, paddingVertical: 4, borderRadius: borderRadius.sm, gap: 4 },
  visibilityIcon: { fontSize: 11 },
  visibilityLabel: { fontSize: 9, fontWeight: "800", letterSpacing: 0.5 },
  description: { fontSize: 13, lineHeight: 19, marginBottom: 9 },
  footer: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  dots: { flexDirection: "row" },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 4 },
  deleteButton: { padding: 4 },
  deleteIcon: { fontSize: 16, opacity: 0.6 },
});
