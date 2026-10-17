import { Pressable, Text, View } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { styles } from "../styles";

export type TodoFilter = "all" | "personal" | "api";

const filters: { value: TodoFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "personal", label: "My tasks" },
  { value: "api", label: "API examples" },
];

interface TodoFilterBarProps {
  value: TodoFilter;
  onChange: (value: TodoFilter) => void;
}

export function TodoFilterBar({ value, onChange }: TodoFilterBarProps) {
  const { theme } = useTheme();
  return (
    <View
      accessibilityRole="tablist"
      accessibilityLabel="Task source"
      style={styles.row}
    >
      {filters.map((filter) => (
        <Pressable
          key={filter.value}
          accessibilityRole="tab"
          accessibilityState={{ selected: value === filter.value }}
          onPress={() => onChange(filter.value)}
          style={({ pressed }) => [
            styles.button,
            styles.filterButton,
            {
              backgroundColor:
                value === filter.value ? theme.accentLight : theme.card,
              borderColor: value === filter.value ? theme.accent : theme.border,
            },
            pressed && styles.pressed,
          ]}
        >
          <Text style={[styles.buttonText, { color: theme.text }]}>
            {filter.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
