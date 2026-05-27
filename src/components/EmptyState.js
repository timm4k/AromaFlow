import { StyleSheet, Text, View } from "react-native";

export default function EmptyState({
  emoji = "📭",
  title,
  subtitle,
  theme,
}) {
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.emojiBox,
          { backgroundColor: theme.accentLight },
        ]}
      >
        <Text style={styles.emoji}>{emoji}</Text>
      </View>

      <Text style={[styles.title, { color: theme.text, fontSize: 20 * theme.fontScale }]}>{title}</Text>

      {subtitle && (
        <Text style={[styles.subtitle, { color: theme.textSecondary, fontSize: 15 * theme.fontScale, lineHeight: 22 * theme.fontScale }]}>
          {subtitle}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingBottom: 80,
  },

  emojiBox: {
    width: 80,
    height: 80,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  emoji: {
    fontSize: 36,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 15,
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 22,
    opacity: 0.7,
  },
});
