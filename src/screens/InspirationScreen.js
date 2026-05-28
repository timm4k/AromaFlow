import { View } from "react-native";
import { FlatList, RefreshControl } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../hooks/useTheme";
import { usePosts } from "../queries/usePosts";
import ScreenHeader from "../components/ScreenHeader";
import EmptyState from "../components/EmptyState";
import InspirationCard from "../components/inspiration/InspirationCard";
import ShimmerPlaceholder from "../components/common/ShimmerPlaceholder";
import { styles } from "../styles/screens/inspirationStyles";

export default function InspirationScreen() {
  const insets = useSafeAreaInsets();
  const { theme, enableAnimations } = useTheme();
  const { data: posts, isLoading, isError, error, refetch, isRefetching } = usePosts();

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <ScreenHeader
        title="Inspirations"
        subtitle="Aromatic stories & wellness reads"
        theme={theme}
        style={{ paddingTop: insets.top + 12 }}
      />

      {isLoading ? (
        <View style={styles.shimmerList}>
          {Array.from({ length: 5 }).map((_, i) => (
            <ShimmerPlaceholder key={i} theme={theme} />
          ))}
        </View>
      ) : isError ? (
        <EmptyState
          emoji="⚠️"
          title="Could not load inspirations"
          subtitle={error?.message || "Something went wrong. Pull down to retry."}
          theme={theme}
        />
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => String(item.id)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={theme.accent}
              colors={[theme.accent]}
            />
          }
          renderItem={({ item, index }) => (
            <InspirationCard
              item={item}
              index={index}
              theme={theme}
              enableAnimations={enableAnimations}
            />
          )}
          ListEmptyComponent={
            <EmptyState
              emoji="📖"
              title="No inspirations yet"
              subtitle="Check back later for new articles"
              theme={theme}
            />
          }
        />
      )}
    </View>
  );
}
