import { Text, TouchableOpacity, View } from "react-native";
import { Animated } from "react-native";
import { shadows } from "../../styles/shadows";
import { styles } from "../../styles/screens/myAromasStyles";
import useCardAnimation from "../../hooks/useCardAnimation";

export default function CustomAromaCard({
  item, theme, onPress, onDelete, favorited,
  onToggleFavorite, enableAnimations, onToggleVisibility, index,
}) {
  const { animatedStyle, onPressIn, onPressOut } = useCardAnimation({ index, enabled: enableAnimations });

  const dots = Array.from({ length: 5 }, (_, i) => i < (item.intensity || 0));

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      >
        <View
          style={[
            styles.card,
            { backgroundColor: theme.card, shadowColor: theme.shadow },
            shadows.card,
          ]}
        >
          <View style={[styles.emojiBox, { backgroundColor: theme.bg }]}>
            <Text style={styles.emoji}>{item.emoji || ""}</Text>
          </View>

          <View style={styles.content}>
            <View style={styles.header}>
              <View style={styles.titleRow}>
                <Text numberOfLines={1} style={[styles.title, { color: theme.text }]}>
                  {item.title || ""}
                </Text>

                <View style={[styles.customBadge, { backgroundColor: theme.accentLight, shadowColor: theme.accent }]}>
                  <Text style={[styles.customBadgeText, { color: theme.accent }]}>CUSTOM</Text>
                </View>
              </View>

              <TouchableOpacity activeOpacity={0.7} onPress={onToggleFavorite} style={styles.favoriteButton}>
                <Text style={[styles.favorite, favorited && styles.favoriteActive]}>
                  {favorited ? "❤️" : "🤍"}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.badgeRow}>
              <View style={[styles.badge, { backgroundColor: theme.accentLight }]}>
                <Text style={[styles.badgeText, { color: theme.accent }]}>{item.category || ""}</Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => onToggleVisibility(item)}
                style={[styles.visibilityToggle, { backgroundColor: theme.accentLight }]}
              >
                <Text style={styles.visibilityIcon}>
                  {item.visibility === "public" ? "🌍" : "🔒"}
                </Text>
                <Text style={[styles.visibilityLabel, { color: theme.accent }]}>
                  {item.visibility === "public" ? "PUBLIC" : "PRIVATE"}
                </Text>
              </TouchableOpacity>
            </View>

            <Text numberOfLines={2} style={[styles.description, { color: theme.textSecondary }]}>
              {item.shortDescription || ""}
            </Text>

            <View style={styles.footer}>
              <View style={styles.dots}>
                {dots.map((filled, i) => (
                  <View
                    key={i}
                    style={[styles.dot, { backgroundColor: filled ? theme.accent : theme.accentLight }]}
                  />
                ))}
              </View>

              <TouchableOpacity activeOpacity={0.7} onPress={onDelete} style={styles.deleteButton}>
                <Text style={styles.deleteIcon}>🗑️</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}
