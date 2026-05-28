import { useEffect, useRef } from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";
import { shadows } from "../../styles/shadows";
import { styles } from "../../styles/screens/inspirationStyles";

export default function InspirationCard({ item, index, theme, enableAnimations }) {
  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    const dur = enableAnimations ? 400 : 0;
    const delay = index * 80;

    Animated.parallel([
      Animated.timing(fadeIn, { toValue: 1, duration: dur, delay, useNativeDriver: true }),
      Animated.timing(slideUp, { toValue: 0, duration: dur, delay, useNativeDriver: true }),
    ]).start();
  }, [enableAnimations, fadeIn, slideUp, index]);

  return (
    <Animated.View style={[styles.cardWrapper, { opacity: fadeIn, transform: [{ translateY: slideUp }] }]}>
      <TouchableOpacity activeOpacity={0.8}>
        <View style={[styles.card, { backgroundColor: theme.card, shadowColor: theme.shadow }, shadows.cardCompact]}>
          <View style={[styles.emojiCircle, { backgroundColor: theme.accentLight }]}>
            <Text style={styles.emoji}>{item.emoji}</Text>
          </View>

          <View style={styles.cardContent}>
            <Text style={[styles.cardTitle, { color: theme.text }]} numberOfLines={2}>
              {item.title}
            </Text>

            <Text style={[styles.cardBody, { color: theme.textSecondary }]} numberOfLines={3}>
              {item.body}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}
