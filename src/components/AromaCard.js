import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function AromaCard({
  title,
  category,
  intensity,
  shortDescription,
  emoji,
  theme,
  compact,
  onPress,
  favorited,
  onToggleFavorite,
}) {
  const dots = Array.from({ length: 5 }, (_, i) => i < (intensity || 0));

  return (
    <TouchableOpacity activeOpacity={0.75} onPress={onPress}>
      <View
        style={[
          styles.card,
          compact && styles.cardCompact,
          {
            backgroundColor: theme.card,

            shadowColor: theme.shadow,
          },
        ]}
      >
        <View
          style={[
            styles.emojiBox,
            compact && styles.emojiBoxCompact,
            {
              backgroundColor: theme.bg,
            },
          ]}
        >
          <Text style={styles.emoji}>{emoji || ""}</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.header}>
            <Text
              numberOfLines={1}
              style={[
                styles.title,
                compact && styles.titleCompact,
                {
                  color: theme.text,
                },
              ]}
            >
              {title || ""}
            </Text>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onToggleFavorite}
              style={styles.favoriteButton}
            >
              <Text
                style={[styles.favorite, favorited && styles.favoriteActive]}
              >
                {favorited ? "❤️" : "🤍"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.badgeRow}>
            <View
              style={[
                styles.badge,
                {
                  backgroundColor: theme.accentLight,
                },
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  {
                    color: theme.accent,
                  },
                ]}
              >
                {category || ""}
              </Text>
            </View>
          </View>

          <Text
            numberOfLines={compact ? 1 : 2}
            style={[
              styles.description,
              compact && styles.descriptionCompact,
              {
                color: theme.textSecondary,
              },
            ]}
          >
            {shortDescription || ""}
          </Text>

          <View style={styles.intensityRow}>
            <Text
              style={[
                styles.intensityLabel,
                {
                  color: theme.accentDim,
                },
              ]}
            >
              Intensity
            </Text>

            <View style={styles.dots}>
              {dots.map((filled, i) => (
                <View
                  key={i}
                  style={[
                    styles.dot,
                    {
                      backgroundColor: filled
                        ? theme.accent
                        : theme.accentLight,
                    },
                  ]}
                />
              ))}
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",

    borderRadius: 22,

    padding: 14,

    marginHorizontal: 14,
    marginVertical: 6,

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.1,
    shadowRadius: 12,

    elevation: 3,
  },

  cardCompact: {
    padding: 12,
    marginVertical: 4,
  },

  emojiBox: {
    width: 58,
    height: 58,

    borderRadius: 16,

    justifyContent: "center",
    alignItems: "center",

    marginRight: 14,
  },

  emojiBoxCompact: {
    width: 46,
    height: 46,

    borderRadius: 12,

    marginRight: 10,
  },

  emoji: {
    fontSize: 28,
  },

  content: {
    flex: 1,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    marginBottom: 5,
  },

  title: {
    flex: 1,

    marginRight: 8,

    fontSize: 17,
    fontWeight: "700",

    letterSpacing: -0.3,
  },

  titleCompact: {
    fontSize: 15,
  },

  favoriteButton: {
    paddingLeft: 8,
    paddingVertical: 2,
  },

  favorite: {
    fontSize: 18,
    opacity: 0.5,
  },

  favoriteActive: {
    opacity: 1,
  },

  badgeRow: {
    flexDirection: "row",

    marginBottom: 5,
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,

    borderRadius: 9,
  },

  badgeText: {
    fontSize: 11,
    fontWeight: "700",

    letterSpacing: 0.3,
  },

  description: {
    fontSize: 13,
    lineHeight: 19,

    marginBottom: 9,
  },

  descriptionCompact: {
    fontSize: 12,
    marginBottom: 5,
  },

  intensityRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  intensityLabel: {
    fontSize: 11,
    fontWeight: "600",

    marginRight: 8,

    letterSpacing: 0.2,
  },

  dots: {
    flexDirection: "row",
  },

  dot: {
    width: 8,
    height: 8,

    borderRadius: 4,

    marginRight: 4,
  },
});
