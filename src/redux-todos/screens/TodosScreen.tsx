import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../hooks/useTheme";
import { spacing } from "../../styles/spacing";
import { AddTodoForm } from "../components/AddTodoForm";
import { TodoButton } from "../components/TodoButton";
import { TodoCard } from "../components/TodoCard";
import { TodoFilterBar, type TodoFilter } from "../components/TodoFilterBar";
import { todosConfig } from "../config";
import { useAddTodoMutation, useGetTodosQuery } from "../services/todosApi";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { addDemoTodo, addTodo } from "../store/slices/todosSlice";
import { styles } from "../styles";

function Separator() {
  return <View style={styles.separator} />;
}

export default function TodosScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const [filter, setFilter] = useState<TodoFilter>("all");
  const localTodos = useAppSelector((state) => state.todos.items);
  const demoTodos = useAppSelector((state) => state.todos.demoItems);
  const savedTodos = useMemo(
    () => new Map(localTodos.map((todo) => [todo.id, todo])),
    [localTodos],
  );
  const {
    data = [],
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetTodosQuery();
  const [createTodo] = useAddTodoMutation();
  const displayedTodos = useMemo(() => {
    if (filter === "api") return data;
    if (filter === "personal")
      return demoTodos.filter((todo) => !savedTodos.has(todo.id));
    return [...demoTodos, ...data];
  }, [demoTodos, data, filter, savedTodos]);
  const displayedDemoCount =
    filter === "api"
      ? 0
      : filter === "personal"
        ? displayedTodos.length
        : demoTodos.length;

  const addLocally = useCallback(
    (title: string) => {
      dispatch(
        addTodo({
          id: Date.now(),
          title,
          completed: false,
          userId: todosConfig.defaultUserId,
        }),
      );
    },
    [dispatch],
  );

  const addOnServer = useCallback(
    async (title: string) => {
      const createdTodo = await createTodo({
        title,
        completed: false,
        userId: todosConfig.defaultUserId,
      }).unwrap();
      dispatch(addDemoTodo(createdTodo));
    },
    [createTodo, dispatch],
  );

  return (
    <View style={[styles.screen, { backgroundColor: theme.bg }]}>
      <FlatList
        data={displayedTodos}
        keyExtractor={(todo) => String(todo.id)}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + spacing.lg },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={refetch}
            tintColor={theme.accent}
            colors={[theme.accent]}
          />
        }
        ItemSeparatorComponent={Separator}
        ListHeaderComponent={
          <View style={styles.section}>
            <Text style={[styles.text, { color: theme.textSecondary }]}>
              Plan your scent sessions locally and explore the shared demo task
              feed
            </Text>
            <Text style={[styles.text, { color: theme.textSecondary }]}>
              Choose My tasks for your own entries and saved examples. Choose
              API examples to browse the server's sample tasks
            </Text>
            <TodoFilterBar value={filter} onChange={setFilter} />
            {filter !== "api" && (
              <>
                <AddTodoForm
                  title={`Local tasks — ${localTodos.length}`}
                  buttonTitle="Add locally"
                  onAdd={addLocally}
                />
                <AddTodoForm
                  title="Server task"
                  buttonTitle="Add to server"
                  onAdd={addOnServer}
                />
                <Text style={[styles.text, { color: theme.textSecondary }]}>
                  JSONPlaceholder simulates saving. Tasks you create through
                  POST stay here as marked demos for this app session
                </Text>
              </>
            )}
            {filter === "api" && (
              <Text style={[styles.text, { color: theme.textSecondary }]}>
                These placeholder titles come directly from JSONPlaceholder.
                Save an example to My tasks to track your own scent session
              </Text>
            )}
            <Text style={[styles.heading, { color: theme.text }]}>
              {filter === "personal"
                ? "My tasks"
                : filter === "api"
                  ? "API examples — JSONPlaceholder"
                  : "Server tasks and confirmed demos"}
            </Text>
            {filter !== "personal" &&
              (isLoading ? (
                <View style={styles.center}>
                  <ActivityIndicator size="large" color={theme.accent} />
                  <Text style={[styles.text, { color: theme.textSecondary }]}>
                    Loading server tasks…
                  </Text>
                </View>
              ) : error ? (
                <View style={styles.center}>
                  <Text
                    accessibilityRole="alert"
                    style={[styles.text, { color: theme.error }]}
                  >
                    Could not load server tasks — saved tasks are still
                    available
                  </Text>
                  <TodoButton
                    title="Try again"
                    onPress={refetch}
                    disabled={isFetching}
                  />
                </View>
              ) : null)}
          </View>
        }
        renderItem={({ item, index }) => (
          <View style={styles.section}>
            {index === 0 && displayedDemoCount > 0 && (
              <Text style={[styles.heading, { color: theme.text }]}>
                Created via POST — session demos
              </Text>
            )}
            {filter === "all" && index === displayedDemoCount && (
              <Text style={[styles.heading, { color: theme.text }]}>
                API examples — JSONPlaceholder
              </Text>
            )}
            <TodoCard
              todo={item}
              savedTodo={savedTodos.get(item.id)}
              isDemo={item.id < 0}
            />
          </View>
        )}
        ListEmptyComponent={
          filter !== "personal" && !isLoading && !error ? (
            <View style={styles.center}>
              <Text style={[styles.text, { color: theme.textSecondary }]}>
                No server tasks
              </Text>
            </View>
          ) : null
        }
        ListFooterComponent={
          filter !== "api" ? (
            <View style={styles.section}>
              <Text style={[styles.heading, { color: theme.text }]}>
                My scent tasks
              </Text>
              <Text style={[styles.text, { color: theme.textSecondary }]}>
                Your list in this app. Tasks, notes and ratings stay in this
                session and are not uploaded. Saving an API example does not
                copy its illustrative rating into your personal rating
              </Text>
              <FlatList
                data={localTodos}
                keyExtractor={(todo) => String(todo.id)}
                scrollEnabled={false}
                contentContainerStyle={styles.localContent}
                ItemSeparatorComponent={Separator}
                renderItem={({ item }) => (
                  <TodoCard todo={item} isLocal isDemo={item.id < 0} />
                )}
                ListEmptyComponent={
                  <Text style={[styles.text, { color: theme.textSecondary }]}>
                    No saved tasks
                  </Text>
                }
              />
            </View>
          ) : null
        }
      />
    </View>
  );
}
