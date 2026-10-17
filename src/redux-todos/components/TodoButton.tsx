import { Pressable, Text } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { styles } from "../styles";

interface TodoButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  checked?: boolean;
}

export function TodoButton({
  title,
  onPress,
  disabled = false,
  checked,
}: TodoButtonProps) {
  const { theme } = useTheme();
  return (
    <Pressable
      accessibilityRole={checked === undefined ? "button" : "checkbox"}
      accessibilityState={{ disabled, checked }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: theme.accentLight },
        disabled && styles.disabled,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.buttonText, { color: theme.text }]}>{title}</Text>
    </Pressable>
  );
}
