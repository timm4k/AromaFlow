import { StyleSheet } from "react-native";
import { borderRadius } from "../styles/spacing";
import { typography } from "../styles/typography";

export const styles = StyleSheet.create({
  cardWrapper: { paddingHorizontal: 16, marginBottom: 10 },
  card: { flexDirection: "row", borderRadius: borderRadius.lg, padding: 14 },
  emojiCircle: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
    marginTop: 2,
  },
  emoji: { fontSize: 22 },
  cardContent: { flex: 1 },
  cardTitle: { ...typography.cardTitleCompact, marginBottom: 4 },
  cardBody: { ...typography.bodySm, lineHeight: 19, opacity: 0.7 },
  readTime: { fontSize: 11, fontWeight: "600", marginTop: 4, opacity: 0.5 },
});
