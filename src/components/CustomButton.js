import { useEffect, useState } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity } from "react-native";
import { shadows } from "../styles/shadows";
import { borderRadius, spacing } from "../styles/spacing";

export default function CustomButton({
  title,
  onPress,
  theme,
  disabled = false,
  variant = "primary",
  enableAnimations,
}) {
  const { scale, onPressIn, onPressOut } = useScaleAnimation(enableAnimations);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        activeOpacity={0.8}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={disabled}
        style={[
          styles.button,
          variant === "danger" && styles.danger,
          {
            backgroundColor: disabled
              ? theme.accentLight
              : variant === "danger"
                ? theme.error
                : theme.accent,

            shadowColor: variant === "danger" ? theme.error : theme.accent,
            opacity: disabled ? 0.5 : 1,
          },
        ]}
      >
        <Text
          style={[
            styles.text,
            {
              color: disabled ? theme.accentDim + "99" : theme.white,
              fontSize: 17 * theme.fontScale,
            },
          ]}
        >
          {title}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

function useScaleAnimation(animationsEnabled) {
  const [scale] = useState(() => new Animated.Value(1));
  useEffect(() => () => scale.stopAnimation(), [scale]);

  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: animationsEnabled ? 0.97 : 1,
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

  return { scale, onPressIn, onPressOut };
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,

    alignItems: "center",
    justifyContent: "center",

    ...shadows.button,
  },

  danger: {
    shadowOpacity: 0.25,
  },

  text: {
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
