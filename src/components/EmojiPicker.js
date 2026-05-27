import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { categoryEmojis } from "../utils/constants";

function EmojiItem({ emoji, selected, onSelect, theme, enableAnimations }) {
  const scale = useRef(new Animated.Value(1)).current;
  const glow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: selected ? 1.2 : 1,
        friction: enableAnimations ? 4 : 0,
        useNativeDriver: true,
      }),
      Animated.timing(glow, {
        toValue: selected ? 1 : 0,
        duration: enableAnimations ? 200 : 0,
        useNativeDriver: false,
      }),
    ]).start();
  }, [selected, enableAnimations]);

  const glowColor = glow.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.accentLight, theme.accent],
  });

  return (
    <Animated.View
      style={[
        styles.emojiWrapper,
        {
          transform: [{ scale }],
          borderColor: selected ? theme.accent : "transparent",
          shadowColor: selected ? theme.accent : "transparent",
          shadowOpacity: selected ? 0.4 : 0,
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => onSelect(emoji)}
        style={[
          styles.emojiButton,
          {
            backgroundColor: selected ? theme.accentLight : theme.card,
          },
        ]}
      >
        <Text style={styles.emoji}>{emoji}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function EmojiPicker({
  selectedCategory,
  selectedEmoji,
  onSelectEmoji,
  theme,
  enableAnimations,
}) {
  const emojis = categoryEmojis[selectedCategory] || [];

  if (!selectedCategory || emojis.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={[styles.emptyText, { color: theme.textSecondary, fontSize: 14 * theme.fontScale }]}>
          Select a category first
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.text, fontSize: 13 * theme.fontScale }]}>Choose Emoji</Text>

      <View style={styles.grid}>
        {emojis.map((emoji) => (
          <EmojiItem
            key={emoji}
            emoji={emoji}
            selected={selectedEmoji === emoji}
            onSelect={onSelectEmoji}
            theme={theme}
            enableAnimations={enableAnimations}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
  },

  label: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 10,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  emojiWrapper: {
    borderRadius: 16,
    borderWidth: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },

  emojiButton: {
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  emoji: {
    fontSize: 26,
  },

  empty: {
    paddingVertical: 16,
    alignItems: "center",
  },

  emptyText: {
    fontSize: 14,
    fontWeight: "500",
    opacity: 0.7,
  },
});
