import { Text, TouchableOpacity, View } from "react-native";
import { Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { shadows } from "../../styles/shadows";
import { styles } from "../../styles/screens/inspirationStyles";
import useCardAnimation from "../../hooks/useCardAnimation";

export default function InspirationCard({ item, index, theme, enableAnimations }) {
  const navigation = useNavigation();
  const { animatedStyle, onPressIn, onPressOut } = useCardAnimation({ index, enabled: enableAnimations });

  function handlePress() {
    navigation.navigate("InspirationDetails", { inspiration: item });
  }

  return (
    <Animated.View style={[styles.cardWrapper, animatedStyle]}>
      <TouchableOpacity activeOpacity={0.8} onPress={handlePress} onPressIn={onPressIn} onPressOut={onPressOut}>
        <View style={[styles.card, { backgroundColor: theme.card, shadowColor: theme.shadow }, shadows.cardCompact]}>
          <View style={[styles.emojiCircle, { backgroundColor: theme.accentLight }]}>
            <Text style={styles.emoji}>{item.emoji}</Text>
          </View>

          <View style={styles.cardContent}>
            <Text style={[styles.cardTitle, { color: theme.text }]} numberOfLines={1}>
              {item.title}
            </Text>

            {item.subtitle && (
              <Text style={[styles.cardBody, { color: theme.textSecondary }]} numberOfLines={2}>
                {item.subtitle}
              </Text>
            )}

            {item.readTime && (
              <Text style={[styles.readTime, { color: theme.accentDim }]}>{item.readTime}</Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}
