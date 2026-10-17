import type { PropsWithChildren } from "react";
import { Pressable, Text, View } from "react-native";
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
  const { theme } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.action,
        { backgroundColor: theme.accentLight },
        disabled && styles.disabled,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.actionText, { color: theme.text }]}>{title}</Text>
    </Pressable>
  );
}
