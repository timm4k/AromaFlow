import { Link } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  AppState,
  FlatList,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ScreenHeader from "../components/ScreenHeader";
import { useTheme } from "../hooks/useTheme";
import { borderRadius, spacing } from "../styles/spacing";
import { OfflineNotice } from "./OfflineNotice";
import { PostCard } from "./PostCard";
import { feedConfig, readPosts, type FeedResponse, type Post } from "./feed";
import { useFetch } from "./useFetch";

const feedRequestOptions =
  Platform.OS === "web"
    ? feedConfig.requestOptions.web
    : feedConfig.requestOptions.native;

export default function PostsScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { data, isLoading, error, refetch } = useFetch<FeedResponse>(
    feedConfig.apiUrl,
    feedRequestOptions,
  );
  const [posts, setPosts] = useState<Post[]>([]);
  const [dataError, setDataError] = useState<string | null>(null);
  const previousAppState = useRef(AppState.currentState);

  useEffect(() => {
    if (!data) return;
    let active = true;
    async function synchronize() {
      try {
        const parsedPosts = await readPosts(data);
        if (active) {
          setPosts(parsedPosts);
          setDataError(null);
        }
      } catch (error) {
        if (active)
          setDataError(
            error instanceof Error
              ? error.message
              : "Could not read the articles",
          );
      }
    }
    void synchronize();
    return () => {
      active = false;
    };
  }, [data]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextState) => {
      if (
        (previousAppState.current === "background" ||
          previousAppState.current === "inactive") &&
        nextState === "active"
      )
        refetch();
      previousAppState.current = nextState;
    });
    return () => subscription.remove();
  }, [refetch]);

  const hidePost = useCallback(
    (id: number) =>
      setPosts((current) => current.filter((post) => post.id !== id)),
    [],
  );
  const failure = error || dataError;
  const retryButton = (
    <Pressable
      accessibilityRole="button"
      onPress={refetch}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: theme.accentLight },
        pressed && styles.pressed,
      ]}
    >
      <Text style={{ color: theme.accent, fontWeight: "700" }}>Try again</Text>
    </Pressable>
  );

  return (
    <View
      style={{ flex: 1, backgroundColor: theme.bg, paddingTop: insets.top }}
    >
      <OfflineNotice />
      <ScreenHeader
        title="Scent reading"
        subtitle="Live references on fragrance and perfumery"
        theme={theme}
        style={{ paddingTop: spacing.sm }}
      />
      <View style={styles.intro}>
        <Link href="/guides" asChild>
          <Pressable
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: theme.accentLight },
              pressed && styles.pressed,
            ]}
          >
            <Text style={{ color: theme.accent, fontWeight: "700" }}>
              AromaFlow guides →
            </Text>
          </Pressable>
        </Link>
        <Text style={{ color: theme.textSecondary, fontSize: 12 }}>
          Pull down to refresh · hidden articles return when refreshed
        </Text>
      </View>
      {isLoading && posts.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.accent} />
          <Text style={{ color: theme.textSecondary }}>
            Finding scent articles…
          </Text>
        </View>
      ) : failure && posts.length === 0 ? (
        <View style={styles.center}>
          <Text
            accessibilityRole="alert"
            style={{ color: theme.text, fontWeight: "700" }}
          >
            Could not load articles
          </Text>
          <Text style={{ color: theme.textSecondary, textAlign: "center" }}>
            {failure}
          </Text>
          {retryButton}
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(post) => String(post.id)}
          contentContainerStyle={{
            paddingBottom: insets.bottom + spacing.xl,
            flexGrow: 1,
          }}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={refetch}
              tintColor={theme.accent}
              colors={[theme.accent]}
            />
          }
          ListHeaderComponent={
            failure ? (
              <View style={styles.intro}>
                <Text accessibilityRole="alert" style={{ color: theme.error }}>
                  Update failed — the previous articles are still available
                </Text>
                {retryButton}
              </View>
            ) : null
          }
          renderItem={({ item }) => (
            <PostCard post={item} onDelete={hidePost} />
          )}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={{ color: theme.text, fontWeight: "700" }}>
                No articles to show
              </Text>
              <Text style={{ color: theme.textSecondary }}>
                Pull down or tap below to bring the feed back
              </Text>
              <Pressable
                accessibilityRole="button"
                onPress={refetch}
                style={({ pressed }) => [
                  styles.button,
                  { backgroundColor: theme.accentLight },
                  pressed && styles.pressed,
                ]}
              >
                <Text style={{ color: theme.accent }}>Refresh articles</Text>
              </Pressable>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  intro: { padding: spacing.md, gap: spacing.sm },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.lg,
    gap: spacing.md,
  },
  button: {
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: "center",
  },
  pressed: { opacity: 0.8 },
});
