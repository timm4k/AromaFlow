import { Text, View } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { useAppDispatch } from "../store/hooks";
import { addTodo, removeTodo, toggleTodo } from "../store/slices/todosSlice";
import { styles } from "../styles";
import type { Todo } from "../types";
import { TodoButton } from "./TodoButton";
import { TodoReflectionPanel } from "./TodoReflectionPanel";

interface TodoCardProps {
  todo: Todo;
  savedTodo?: Todo;
  isLocal?: boolean;
  isDemo?: boolean;
}

export function TodoCard({
  todo,
  savedTodo,
  isLocal = false,
  isDemo = false,
}: TodoCardProps) {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const localTodo = isLocal ? todo : savedTodo;
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.card, borderColor: theme.border },
      ]}
    >
      {isDemo && (
        <Text style={[styles.text, { color: theme.accent }]}>
          Demo — not stored on server
        </Text>
      )}
      <Text numberOfLines={2} style={[styles.title, { color: theme.text }]}>
        {todo.title}
      </Text>
      <Text style={[styles.text, { color: theme.textSecondary }]}>
        {todo.completed ? "Completed" : "To do"}
      </Text>
      {localTodo ? (
        <>
          {!isLocal && (
            <Text style={[styles.text, { color: theme.accent }]}>
              Saved in My scent tasks
            </Text>
          )}
          <View style={styles.row}>
            <TodoButton
              title={
                localTodo.completed ? "☑ Completed locally" : "☐ Mark complete"
              }
              checked={localTodo.completed}
              onPress={() => dispatch(toggleTodo(localTodo.id))}
            />
            <TodoButton
              title="Remove locally"
              onPress={() => dispatch(removeTodo(localTodo.id))}
            />
          </View>
        </>
      ) : (
        <TodoButton
          title="Save to My scent tasks"
          onPress={() => dispatch(addTodo(todo))}
        />
      )}
      <TodoReflectionPanel
        todoId={todo.id}
        editable={isLocal}
        isSaved={Boolean(localTodo)}
      />
    </View>
  );
}
