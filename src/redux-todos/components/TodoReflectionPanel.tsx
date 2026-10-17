import { Pressable, Text, TextInput, View } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { todosConfig } from "../config";
import { exampleReflections } from "../exampleReflections";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { updateTodoReflection } from "../store/slices/todosSlice";
import { styles } from "../styles";
import { TodoButton } from "./TodoButton";

interface TodoReflectionPanelProps {
  todoId: number;
  editable: boolean;
  isSaved: boolean;
}

const ratingValues = Array.from(
  { length: todosConfig.maxRating },
  (_, index) => index + 1,
);

export function TodoReflectionPanel({
  todoId,
  editable,
  isSaved,
}: TodoReflectionPanelProps) {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const reflection = useAppSelector((state) => state.todos.reflections[todoId]);
  const example = !isSaved ? exampleReflections[todoId] : undefined;
  const displayed = reflection ?? example;
  const notes = displayed?.notes ?? "";
  const rating = displayed?.rating ?? null;

  return (
    <View style={styles.reflection}>
      <Text style={[styles.buttonText, { color: theme.text }]}>
        {example
          ? "Illustrative scent notes — not API data"
          : "Your scent notes"}
      </Text>
      {editable ? (
        <>
          <TextInput
            accessibilityLabel="Scent notes"
            multiline
            maxLength={todosConfig.maxNotesLength}
            placeholder="What did you notice? Which notes worked together?"
            placeholderTextColor={theme.textSecondary}
            value={notes}
            onChangeText={(value) =>
              dispatch(
                updateTodoReflection({ id: todoId, changes: { notes: value } }),
              )
            }
            style={[
              styles.input,
              styles.notesInput,
              { color: theme.text, borderColor: theme.border },
            ]}
          />
          <Text style={[styles.text, { color: theme.textSecondary }]}>
            Your rating:{" "}
            {rating === null
              ? "Not rated"
              : `${rating} / ${todosConfig.maxRating}`}
          </Text>
          <View
            accessibilityRole="radiogroup"
            accessibilityLabel="Scent session rating"
            style={styles.row}
          >
            {ratingValues.map((value) => (
              <Pressable
                key={value}
                accessibilityRole="radio"
                accessibilityLabel={`${value} out of ${todosConfig.maxRating} stars`}
                accessibilityState={{ selected: rating === value }}
                onPress={() =>
                  dispatch(
                    updateTodoReflection({
                      id: todoId,
                      changes: { rating: value },
                    }),
                  )
                }
                style={({ pressed }) => [
                  styles.ratingButton,
                  {
                    borderColor: theme.border,
                    backgroundColor:
                      rating === value ? theme.accentLight : theme.bg,
                  },
                  pressed && styles.pressed,
                ]}
              >
                <Text style={[styles.buttonText, { color: theme.text }]}>
                  {value} ★
                </Text>
              </Pressable>
            ))}
          </View>
          {rating !== null && (
            <TodoButton
              title="Clear rating"
              onPress={() =>
                dispatch(
                  updateTodoReflection({
                    id: todoId,
                    changes: { rating: null },
                  }),
                )
              }
            />
          )}
          <Text style={[styles.caption, { color: theme.textSecondary }]}>
            Notes and ratings update as you edit, only for this app session
          </Text>
        </>
      ) : (
        <>
          <Text style={[styles.text, { color: theme.textSecondary }]}>
            {notes || "No notes yet"}
          </Text>
          <Text style={[styles.text, { color: theme.textSecondary }]}>
            {example ? "Example rating" : "Your rating"}:{" "}
            {rating === null
              ? "Not rated"
              : `${rating} / ${todosConfig.maxRating} ★`}
          </Text>
          <Text style={[styles.caption, { color: theme.textSecondary }]}>
            {isSaved
              ? "Open My tasks to edit your notes and rating"
              : "Save to My scent tasks to add your own notes and rating"}
          </Text>
        </>
      )}
    </View>
  );
}
