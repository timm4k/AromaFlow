import { useEffect, useRef } from "react";
import { Animated } from "react-native";

export default function useCardAnimation({ index = 0, enabled = true } = {}) {
  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(20)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const dur = enabled ? 400 : 0;
    const delay = (index || 0) * 80;

    Animated.parallel([
      Animated.timing(fadeIn, { toValue: 1, duration: dur, delay, useNativeDriver: true }),
      Animated.timing(slideUp, { toValue: 0, duration: dur, delay, useNativeDriver: true }),
    ]).start();
  }, [enabled, index, fadeIn, slideUp]);

  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: enabled ? 0.97 : 1,
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

  return {
    animatedStyle: {
      opacity: fadeIn,
      transform: [{ translateY: slideUp }, { scale }],
    },
    onPressIn,
    onPressOut,
  };
}
