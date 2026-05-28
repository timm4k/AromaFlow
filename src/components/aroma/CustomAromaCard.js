import { useEffect, useRef } from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";
import { shadows } from "../../styles/shadows";
import { styles } from "../../styles/screens/myAromasStyles";

export default function CustomAromaCard({
  item, theme, onPress, onDelete, favorited,
  onToggleFavorite, enableAnimations, onToggleVisibility,
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const fadeIn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const dur = enableAnimations ? 400 : 0;

    Animated.timing(fadeIn, {
      toValue: 1,
      duration: dur,
      useNativeDriver: true,
    }).start();
  }, [enableAnimations, fadeIn]);

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

  const dots = Array.from({ length: 5 }, (_, i) => i < (item.intensity || 0));

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
