import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const levels = [
  { value: 1, label: "Very Light" },
  { value: 2, label: "Light" },
  { value: 3, label: "Moderate" },
  { value: 4, label: "Strong" },
  { value: 5, label: "Intense" },
];

function IntensityDot({ level, value, selected, onPress, theme, enableAnimations }) {
  const scale = useRef(new Animated.Value(1)).current;
  const active = value >= level;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: value === level ? 1.25 : 1,
      friction: enableAnimations ? 4 : 0,
      useNativeDriver: true,
    }).start();
  }, [value, level, enableAnimations]);

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => onPress(level)}
      style={styles.dotContainer}
    >
      <Animated.View
        style={[
          styles.dot,
          {
            transform: [{ scale }],
            backgroundColor: active ? theme.accent : theme.accentLight,
            shadowColor: active ? theme.accent : "transparent",
            shadowOpacity: active ? 0.5 : 0,
          },
        ]}
      />
    </TouchableOpacity>
  );
}

export default function IntensitySlider({ value, onChange, theme, enableAnimations }) {
  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.text, fontSize: 13 * theme.fontScale }]}>
        Intensity
      </Text>

      <View style={styles.slider}>
        <View style={styles.track}>
          <View
            style={[
              styles.trackFill,
              {
                width: `${(value / 5) * 100}%`,
                backgroundColor: theme.accent,
              },
            ]}
          />
        </View>

        <View style={styles.dotsRow}>
          {levels.map((level) => (
            <IntensityDot
              key={level.value}
              level={level.value}
              value={value}
              selected={value === level.value}
              onPress={onChange}
              theme={theme}
              enableAnimations={enableAnimations}
            />
          ))}
        </View>
      </View>

      <Text
        style={[
          styles.valueLabel,
          { color: value > 0 ? theme.accent : theme.textSecondary, fontSize: 13 * theme.fontScale },
        ]}
      >
        {levels.find((l) => l.value === value)?.label || "Select intensity"}
      </Text>
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
    marginBottom: 14,
  },

  slider: {
    position: "relative",
    marginBottom: 8,
  },

  track: {
    position: "absolute",
    top: 14,
    left: 4,
    right: 4,
    height: 6,
    borderRadius: 3,
    backgroundColor: "transparent",
    overflow: "hidden",
  },

  trackFill: {
    height: "100%",
    borderRadius: 3,
  },

  dotsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 2,
  },

  dotContainer: {
    padding: 6,
  },

  dot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },

  valueLabel: {
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
    opacity: 0.8,
  },
});
