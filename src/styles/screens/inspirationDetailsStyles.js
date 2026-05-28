import { StyleSheet } from "react-native";
import { spacing } from "../../styles/spacing";
import { borderRadius } from "../../styles/spacing";

export const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: spacing.md, paddingBottom: spacing.sm,
  },
  backBtn: { width: 44, height: 44, justifyContent: "center", alignItems: "center" },
  backArrow: { fontSize: 28, fontWeight: "600" },
  shareBtn: { width: 44, height: 44, justifyContent: "center", alignItems: "center" },
  heroSection: {
    alignItems: "center", paddingHorizontal: spacing.lg,
    paddingTop: spacing.md, paddingBottom: spacing.xl,
  },
  emojiCircle: {
    width: 100, height: 100, borderRadius: 50,
    justifyContent: "center", alignItems: "center", marginBottom: spacing.lg,
  },
  heroEmoji: { fontSize: 48 },
  title: { fontSize: 24, fontWeight: "700", textAlign: "center", marginBottom: spacing.xs },
  subtitle: { fontSize: 16, fontWeight: "500", textAlign: "center", opacity: 0.7, marginBottom: spacing.md },
  metaRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.md },
  badge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 50 },
  badgeText: { fontSize: 13, fontWeight: "600" },
  meta: { fontSize: 13, fontWeight: "500", opacity: 0.6 },
  sourceBtn: {
    paddingHorizontal: 20, paddingVertical: 10, borderRadius: borderRadius.md, borderWidth: 1.5,
  },
  sourceBtnText: { fontSize: 14, fontWeight: "700" },
  contentSection: { paddingHorizontal: spacing.lg },
  body: { fontSize: 16, lineHeight: 26, fontWeight: "400", marginBottom: spacing.xl },
  tipsCard: {
    padding: spacing.lg, borderRadius: borderRadius.xl, marginBottom: spacing.xl,
  },
  tipsTitle: { fontSize: 18, fontWeight: "700", marginBottom: spacing.md },
  tipRow: { flexDirection: "row", marginBottom: spacing.sm, gap: spacing.sm },
  tipBullet: { fontSize: 16, fontWeight: "700", width: 12 },
  tipText: { fontSize: 15, lineHeight: 22, flex: 1 },
});
