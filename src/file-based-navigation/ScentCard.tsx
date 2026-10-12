import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import useCardAnimation from "../hooks/useCardAnimation";
import { useTheme } from "../hooks/useTheme";
import { borderRadius, spacing } from "../styles/spacing";
import { ScentImage } from "./ScentImage";
import type { Scent } from "./scentCatalog";

export interface ScentCardProps {
  item: Scent;
  onPress?: () => void;
  favorited?: boolean;
  onToggleFavorite?: () => void;
  compact?: boolean;
  showEmojis?: boolean;
  enableAnimations?: boolean;
  index?: number;
}

export function ScentCard({
  item,
  onPress,
  favorited,
  onToggleFavorite,
  compact,
  showEmojis = true,
  enableAnimations = true,
  index = 0,
}: ScentCardProps) {
  const { theme } = useTheme();
  const { animatedStyle, onPressIn, onPressOut } = useCardAnimation({
    index,
    enabled: enableAnimations,
  });
  return (
    <Animated.View
      style={[
        styles.card,
        { backgroundColor: theme.card, borderColor: theme.border },
        animatedStyle,
      ]}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Explore ${item.title}`}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={({ pressed }) => [pressed && styles.pressed]}
      >
        {!compact && (
          <ScentImage
            subject={item.photoSearch}
            title={item.title}
            emoji={showEmojis ? item.emoji : ""}
            height={160}
          />
        )}
        <View style={styles.body}>
          <Text
            style={{
              color: theme.text,
              fontSize: 19 * theme.fontScale,
              fontWeight: "700",
            }}
          >
            {item.title}
          </Text>
          <Text style={{ color: theme.textSecondary }}>{item.origin}</Text>
          <Text style={{ color: theme.accent }}>
            {item.category} · Intensity {item.intensity}/5
          </Text>
          <Text style={{ color: theme.textSecondary }}>
            ★ {item.rating.toFixed(1)} · Sample discovery rating
          </Text>
          <Text style={{ color: theme.textSecondary, lineHeight: 22 }}>
            {item.shortDescription}
          </Text>
        </View>
      </Pressable>
      {onToggleFavorite && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${favorited ? "Unsave" : "Save"} ${item.title}`}
          accessibilityState={{ selected: Boolean(favorited) }}
          onPress={onToggleFavorite}
          style={({ pressed }) => [
            styles.favorite,
            { borderTopColor: theme.border },
            pressed && styles.pressed,
          ]}
        >
          <Text style={{ color: theme.accent }}>
            {favorited ? "♥ Saved to favorites" : "♡ Save to favorites"}
          </Text>
        </Pressable>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    overflow: "hidden",
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  body: { padding: spacing.md, gap: spacing.sm },
  favorite: { padding: spacing.md, alignItems: "center", borderTopWidth: 1 },
  pressed: { opacity: 0.78 },
});
