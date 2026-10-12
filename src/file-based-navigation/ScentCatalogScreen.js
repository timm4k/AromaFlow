import { useMemo, useState } from "react";
import { useRouter } from "expo-router";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ScentCard } from "./ScentCard";
import { scentCatalog } from "./scentCatalog";
import CategoryFilter from "../components/CategoryFilter";
import ScreenHeader from "../components/ScreenHeader";
import SearchBar from "../components/SearchBar";

import { categories } from "../data/aromas";
import { spacing } from "../styles/spacing";
import { filterAromas } from "../utils/filterAromas";

export default function ScentCatalogScreen({
  theme,
  compactCards,
  favorites,
  favoritesOnly,
  onToggleFavorite,
  showEmojis,
  enableAnimations,
}) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filtered = useMemo(
    () => filterAromas(scentCatalog, searchQuery, selectedCategory),
    [searchQuery, selectedCategory],
  );

  const visibleAromas = favoritesOnly
    ? filtered.filter((aroma) => favorites.includes(aroma.id))
    : filtered;

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <ScreenHeader
        title="Aromas"
        subtitle="Built-in aromatic components"
        theme={theme}
        style={{ paddingTop: insets.top + 12 }}
      />

      <SearchBar query={searchQuery} onChange={setSearchQuery} theme={theme} />

      <CategoryFilter
        categories={categories}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
        theme={theme}
        enableAnimations={enableAnimations}
      />

      <View style={styles.countRow}>
        <Text style={[styles.countText, { color: theme.textSecondary }]}>
          {visibleAromas.length}{" "}
          {visibleAromas.length === 1 ? "aroma" : "aromas"}
          {favoritesOnly ? " (favorites)" : ""}
        </Text>
      </View>

      <FlatList
        initialNumToRender={4}
        maxToRenderPerBatch={4}
        windowSize={5}
        data={visibleAromas}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={{ color: theme.textSecondary, padding: spacing.lg }}>
            No scents match your filters — try another name or scent family
          </Text>
        }
        renderItem={({ item, index }) => (
          <ScentCard
            item={item}
            compact={compactCards}
            showEmojis={showEmojis}
            enableAnimations={enableAnimations}
            index={index}
            onPress={() =>
              router.push({ pathname: "/aroma/[id]", params: { id: item.id } })
            }
            favorited={favorites.includes(item.id)}
            onToggleFavorite={() => onToggleFavorite(item.id)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  countRow: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },

  countText: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.3,
    opacity: 0.6,
  },

  list: {
    paddingTop: spacing.xs,
    paddingBottom: 120,
  },
});
