import { useEffect, useRef } from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

function CategoryPill({ cat, active, onSelect, theme, animationsEnabled }) {
  const bgAnim = useRef(new Animated.Value(active ? 1 : 0)).current;

  useEffect(() => {
    const dur = animationsEnabled ? 200 : 0;
    Animated.timing(bgAnim, {
      toValue: active ? 1 : 0,
      duration: dur,
      useNativeDriver: false,
    }).start();
  }, [active, animationsEnabled]);

  const bgColor = bgAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.accentLight, theme.accent],
  });

  const textColor = bgAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.accent, theme.white],
  });

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={() => onSelect(cat)}
    >
      <Animated.View
        style={[
          styles.pill,
          {
            backgroundColor: bgColor,
            borderColor: active ? theme.accent : "transparent",
          },
        ]}
      >
        <Animated.Text
          numberOfLines={1}
          style={[
            styles.label,
            { color: textColor, fontSize: 13 * theme.fontScale },
          ]}
        >
          {cat}
        </Animated.Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

export default function CategoryFilter({
  categories,
  selected,
  onSelect,
  theme,
  enableAnimations,
}) {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map((cat) => (
          <CategoryPill
            key={cat}
            cat={cat}
            active={selected === cat}
            onSelect={onSelect}
            theme={theme}
            animationsEnabled={enableAnimations}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },

  scrollContent: {
    paddingLeft: 16,
    paddingRight: 10,
  },

  pill: {
    minHeight: 42,

    justifyContent: "center",
    alignItems: "center",

    paddingHorizontal: 16,
    paddingVertical: 10,

    marginRight: 8,

    borderRadius: 14,
    borderWidth: 1.5,
  },

  label: {
    fontSize: 13,

    letterSpacing: 0.2,

    includeFontPadding: false,
    textAlignVertical: "center",
  },
});
