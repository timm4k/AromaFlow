import { useEffect, useState } from "react";
import { Animated } from "react-native";

export default function useCardAnimation({ index = 0, enabled = true } = {}) {
  const [fadeIn] = useState(() => new Animated.Value(0));
  const [slideUp] = useState(() => new Animated.Value(20));
  const [scale] = useState(() => new Animated.Value(1));

  useEffect(() => {
    const dur = enabled ? 400 : 0;
    const delay = (index || 0) * 80;

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
    return () => {
      animation.stop();
      scale.stopAnimation();
    };
  }, [enabled, index, fadeIn, slideUp, scale]);

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
