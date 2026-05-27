import { useRef } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity } from "react-native";

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
  const scale = useRef(new Animated.Value(1)).current;

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
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 20,

    alignItems: "center",
    justifyContent: "center",

    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
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
