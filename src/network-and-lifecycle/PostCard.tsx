import {
  Alert,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useTheme } from "../hooks/useTheme";
import { borderRadius, spacing } from "../styles/spacing";
import type { Post } from "./feed";
import { feedConfig } from "./feed";

export interface PostCardProps {
  post: Post;
  onDelete: (id: number) => void;
}

export function PostCard({ post, onDelete }: PostCardProps) {
  const { theme } = useTheme();
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.card, borderColor: theme.border },
      ]}
    >
      <Text
        numberOfLines={2}
        style={{
          fontSize: 18 * theme.fontScale,
          fontWeight: "700",
          color: theme.text,
        }}
      >
        {post.title}
      </Text>
      <Text
        numberOfLines={3}
        style={{
          color: theme.textSecondary,
          fontSize: 14 * theme.fontScale,
          lineHeight: 21 * theme.fontScale,
        }}
      >
        {post.body}
      </Text>
      <View style={styles.actions}>
        <Pressable
          accessibilityRole="link"
          accessibilityLabel={`Read ${post.title} on ${feedConfig.sourceName}`}
          onPress={async () => {
            try {
              await Linking.openURL(post.sourceUrl);
            } catch {
              Alert.alert(
                "Article unavailable",
                "Could not open the article source",
              );
            }
          }}
          style={({ pressed }) => [styles.button, pressed && styles.pressed]}
        >
          <Text style={{ color: theme.accent, fontWeight: "600" }}>
            Read article ↗
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Hide ${post.title}`}
          onPress={() => onDelete(post.id)}
          style={({ pressed }) => [styles.button, pressed && styles.pressed]}
        >
          <Text style={{ color: theme.textSecondary }}>Hide</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    padding: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderRadius: borderRadius.lg,
  },
  actions: { flexDirection: "row", justifyContent: "space-between" },
  button: { paddingVertical: spacing.sm, paddingHorizontal: spacing.xs },
  pressed: { opacity: 0.7 },
});
