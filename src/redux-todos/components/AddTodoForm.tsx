import { useRef, useState } from "react";
import { ActivityIndicator, Text, TextInput, View } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { styles } from "../styles";
import { TodoButton } from "./TodoButton";

interface AddTodoFormProps {
  title: string;
  buttonTitle: string;
  onAdd: (title: string) => void | Promise<void>;
}

export function AddTodoForm({ title, buttonTitle, onAdd }: AddTodoFormProps) {
  const { theme } = useTheme();
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const busy = useRef(false);

  async function submit() {
    const value = text.trim();
    if (!value || busy.current) return;
    busy.current = true;
    setIsSubmitting(true);
    setError(null);
    try {
      await onAdd(value);
      setText("");
    } catch {
      setError("Could not add the task — check your connection and try again");
    } finally {
      busy.current = false;
      setIsSubmitting(false);
    }
  }

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.card, borderColor: theme.border },
      ]}
    >
      <Text style={[styles.heading, { color: theme.text }]}>{title}</Text>
      <TextInput
        accessibilityLabel={title}
        placeholder="Plan a scent discovery session"
        placeholderTextColor={theme.textSecondary}
        value={text}
        onChangeText={setText}
        editable={!isSubmitting}
        returnKeyType="done"
        onSubmitEditing={() => void submit()}
        style={[styles.input, { color: theme.text, borderColor: theme.border }]}
      />
      <TodoButton
        title={isSubmitting ? "Adding…" : buttonTitle}
        disabled={isSubmitting || !text.trim()}
        onPress={() => void submit()}
      />
      {isSubmitting && (
        <ActivityIndicator
          accessibilityLabel="Adding task"
          color={theme.accent}
        />
      )}
      {error && (
        <Text
          accessibilityRole="alert"
          style={[styles.text, { color: theme.error }]}
        >
          {error}
        </Text>
      )}
    </View>
  );
}
