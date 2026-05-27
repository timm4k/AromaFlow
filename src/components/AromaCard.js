import { useEffect, useRef } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { shadows } from "../styles/shadows";
import { borderRadius } from "../styles/spacing";
import { typography } from "../styles/typography";

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
  enableAnimations,
}) {
  const dots = Array.from(
    { length: 5 },
    (_, i) => i < (intensity || 0),
  );

  const scale = useRef(new Animated.Value(1)).current;
  const fadeIn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const dur = enableAnimations ? 400 : 0;

    Animated.timing(fadeIn, {
      toValue: 1,
      duration: dur,
      useNativeDriver: true,
    }).start();
  }, []);

  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: enableAnimations ? 0.97 : 1,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale }], opacity: fadeIn }}>
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      >
        <View
          style={[
            styles.card,
            compact && styles.cardCompact,
            {
              backgroundColor: theme.card,
              shadowColor: theme.shadow,
            },
            shadows.card,
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
                    fontSize: compact
                      ? 15 * theme.fontScale
                      : 17 * theme.fontScale,
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
                  style={[
                    styles.favorite,
                    favorited && styles.favoriteActive,
                  ]}
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
                      fontSize: 11 * theme.fontScale,
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
                  fontSize: compact
                    ? 12 * theme.fontScale
                    : 13 * theme.fontScale,
                  lineHeight: compact
                    ? 17 * theme.fontScale
                    : 19 * theme.fontScale,
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
                    fontSize: 11 * theme.fontScale,
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
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    borderRadius: borderRadius.xxl,
    padding: 14,
    marginHorizontal: 14,
    marginVertical: 6,
  },

  cardCompact: {
    padding: 12,
    marginVertical: 4,
  },

  emojiBox: {
    width: 58,
    height: 58,
    borderRadius: borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  emojiBoxCompact: {
    width: 46,
    height: 46,
    borderRadius: borderRadius.sm + 4,
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
    ...typography.cardTitle,
  },

  titleCompact: {
    ...typography.cardTitleCompact,
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
    borderRadius: borderRadius.sm,
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
