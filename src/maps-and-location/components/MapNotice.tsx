import type { PropsWithChildren } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useTheme } from "../../hooks/useTheme";
import { styles } from "../styles";

interface MapNoticeProps extends PropsWithChildren {
  icon: string;
  title: string;
  message: string;
}

export function MapNotice({ icon, title, message, children }: MapNoticeProps) {
  const { theme } = useTheme();
  return (
    <View style={[styles.notice, { backgroundColor: theme.bg }]}>
      <Text style={styles.noticeIcon}>{icon}</Text>
      <Text style={[styles.heading, { color: theme.text }]}>{title}</Text>
      <Text style={[styles.message, { color: theme.textSecondary }]}>
        {message}
      </Text>
      {children}
    </View>
  );
}

interface MapActionProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}

export function MapAction({
  title,
  onPress,
  disabled = false,
}: MapActionProps) {
  const { theme, enableAnimations } = useTheme();
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.get() }],
  }));
  const animatePress = (pressed: boolean) => {
    scale.set(
      withSpring(pressed && enableAnimations ? 0.96 : 1, {
        stiffness: 280,
        damping: 22,
        reduceMotion: ReduceMotion.System,
      }),
    );
  };
  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={onPress}
        onPressIn={() => animatePress(true)}
        onPressOut={() => animatePress(false)}
        style={({ pressed }) => [
          styles.action,
          { backgroundColor: theme.accentLight },
          disabled && styles.disabled,
          pressed && styles.pressed,
        ]}
      >
        <Text style={[styles.actionText, { color: theme.text }]}>{title}</Text>
      </Pressable>
    </Animated.View>
  );
}
