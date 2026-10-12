import { useEffect, useState } from "react";
import { Animated } from "react-native";

export default function useEntranceAnimation({
  enabled = true,
  fadeFrom = 0,
  slideFrom = 40,
  duration = 600,
  delay = 0,
} = {}) {
  const [fadeIn] = useState(() => new Animated.Value(fadeFrom));
  const [slideUp] = useState(() => new Animated.Value(slideFrom));

  useEffect(() => {
    const dur = enabled ? duration : 0;

    const animation = Animated.parallel([
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
    ]);
    animation.start();
    return () => animation.stop();
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
