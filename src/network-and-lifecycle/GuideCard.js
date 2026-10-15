import { useRouter } from "expo-router";
import { Animated, Pressable, Text, View } from "react-native";
import useCardAnimation from "../hooks/useCardAnimation";
import { shadows } from "../styles/shadows";
import { styles } from "./guideStyles";

export default function GuideCard({ item, index, theme, enableAnimations }) {
  const router = useRouter();
  const { animatedStyle, onPressIn, onPressOut } = useCardAnimation({
    index,
    enabled: enableAnimations,
  });

  function handlePress() {
    router.push({ pathname: "/inspiration/[id]", params: { id: item.id } });
  }

  return (
    <Animated.View style={[styles.cardWrapper, animatedStyle]}>
      <Pressable
        accessibilityRole="button"
        style={({ pressed }) => [pressed && { opacity: 0.8 }]}
        onPress={handlePress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      >
        <View
          style={[
            styles.card,
            { backgroundColor: theme.card, shadowColor: theme.shadow },
            shadows.cardCompact,
          ]}
        >
          <View
            style={[styles.emojiCircle, { backgroundColor: theme.accentLight }]}
          >
            <Text style={styles.emoji}>{item.emoji}</Text>
          </View>

          <View style={styles.cardContent}>
            <Text
              style={[styles.cardTitle, { color: theme.text }]}
              numberOfLines={1}
            >
              {item.title}
            </Text>

            {item.subtitle && (
              <Text
                style={[styles.cardBody, { color: theme.textSecondary }]}
                numberOfLines={2}
              >
                {item.subtitle}
              </Text>
            )}

            {item.readTime && (
              <Text style={[styles.readTime, { color: theme.accentDim }]}>
                {item.readTime}
              </Text>
            )}
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}
