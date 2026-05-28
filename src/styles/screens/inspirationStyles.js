import { StyleSheet } from "react-native";
import { borderRadius, spacing } from "../spacing";
import { typography } from "../typography";

export const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { paddingTop: spacing.sm, paddingBottom: 120 },
  shimmerList: { padding: 16, gap: 10 },
  cardWrapper: { paddingHorizontal: 16, marginBottom: 10 },
  card: { flexDirection: "row", borderRadius: borderRadius.lg, padding: 14 },
  emojiCircle: { width: 48, height: 48, borderRadius: borderRadius.md, justifyContent: "center", alignItems: "center", marginRight: 14, marginTop: 2 },
  emoji: { fontSize: 22 },
  cardContent: { flex: 1 },
  cardTitle: { ...typography.cardTitleCompact, marginBottom: 4 },
  cardBody: { ...typography.bodySm, lineHeight: 19, opacity: 0.7 },
  readTime: { fontSize: 11, fontWeight: "600", marginTop: 4, opacity: 0.5 },
  shimmerCard: { flexDirection: "row", borderRadius: borderRadius.lg, padding: 14, marginBottom: 10 },
  shimmerCircle: { width: 48, height: 48, borderRadius: borderRadius.md, marginRight: 14, opacity: 0.5 },
  shimmerContent: { flex: 1, gap: 8, paddingTop: 4 },
  shimmerLine: { height: 12, borderRadius: 6, opacity: 0.4 },
});
