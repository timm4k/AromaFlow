import { useEffect, useRef } from "react";
import { Animated } from "react-native";

export default function useEntranceAnimation({
  enabled = true,
  fadeFrom = 0,
  slideFrom = 40,
  duration = 600,
  delay = 0,
} = {}) {
  const fadeIn = useRef(new Animated.Value(fadeFrom)).current;
  const slideUp = useRef(new Animated.Value(slideFrom)).current;

  useEffect(() => {
    const dur = enabled ? duration : 0;

    Animated.parallel([
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: dur,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(slideUp, {
        toValue: 0,
        duration: dur,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [enabled, duration, delay, fadeIn, slideUp]);

  return {
    animatedStyle: {
      opacity: fadeIn,
      transform: [{ translateY: slideUp }],
    },
    fadeIn,
    slideUp,
  };
}
