import { Text, View } from "react-native";
import { StyleSheet } from "react-native";
import { borderRadius } from "../../styles/spacing";
import { typography } from "../../styles/typography";

export default function ModalAromaContent({ aroma, theme }) {
  const dots = Array.from({ length: 5 }, (_, i) => i < (aroma.intensity || 0));

  return (
    <>
      <View style={[styles.emojiBox, { backgroundColor: theme.bg }]}>
        <Text style={styles.emoji}>{aroma.emoji || ""}</Text>
      </View>

      <Text style={[styles.title, { color: theme.text, fontSize: 28 * theme.fontScale }]}>
        {aroma.title || ""}
      </Text>

      <View style={[styles.badge, { backgroundColor: theme.accentLight }]}>
        <Text style={[styles.badgeText, { color: theme.accent, fontSize: 13 * theme.fontScale }]}>
          {aroma.category || ""}
        </Text>
      </View>

      <View style={styles.intensityRow}>
        <Text style={[styles.intensityLabel, { color: theme.textSecondary, fontSize: 13 * theme.fontScale }]}>
          Intensity
        </Text>
        <View style={styles.dots}>
          {dots.map((filled, i) => (
            <View key={i} style={[styles.dot, { backgroundColor: filled ? theme.accent : theme.accentLight }]} />
          ))}
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: theme.border }]} />

      <Text style={[styles.description, { color: theme.textSecondary, fontSize: 15 * theme.fontScale, lineHeight: 23 * theme.fontScale }]}>
        {aroma.fullDescription || ""}
      </Text>

      <View style={styles.detailRow}>
        <Text style={[styles.detailLabel, { color: theme.text, fontSize: 13 * theme.fontScale }]}>Origin</Text>
        <Text style={[styles.detailValue, { color: theme.textSecondary, fontSize: 15 * theme.fontScale, lineHeight: 21 * theme.fontScale }]}>
          {aroma.origin || ""}
        </Text>
      </View>

      <View style={styles.detailRow}>
        <Text style={[styles.detailLabel, { color: theme.text, fontSize: 13 * theme.fontScale }]}>Best for</Text>
        <Text style={[styles.detailValue, { color: theme.textSecondary, fontSize: 15 * theme.fontScale, lineHeight: 21 * theme.fontScale }]}>
          {aroma.recommendedUsage || ""}
        </Text>
      </View>

      <View style={[styles.moodBox, { backgroundColor: theme.accentLight }]}>
        <Text style={styles.moodIcon}>✨</Text>
        <Text style={[styles.moodText, { color: theme.accent, fontSize: 15 * theme.fontScale }]}>
          {aroma.mood || ""}
        </Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
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
  intensityRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 18 },
  intensityLabel: { fontSize: 13, fontWeight: "600", marginRight: 10 },
  dots: { flexDirection: "row" },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 5 },
  divider: { height: 1, marginBottom: 18 },
  description: { fontSize: 15, lineHeight: 23, marginBottom: 18 },
  detailRow: { marginBottom: 16 },
  detailLabel: { fontSize: 13, fontWeight: "700", textTransform: "uppercase", marginBottom: 4 },
  detailValue: { fontSize: 15, lineHeight: 21 },
  moodBox: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    padding: 14, borderRadius: borderRadius.md, marginTop: 6,
  },
  moodIcon: { fontSize: 18, marginRight: 8 },
  moodText: { fontSize: 15, fontWeight: "700" },
});
