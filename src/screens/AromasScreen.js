import { useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import AromaCard from "../components/AromaCard";
import AromaModal from "../components/AromaModal";
import CategoryFilter from "../components/CategoryFilter";
import ScreenHeader from "../components/ScreenHeader";
import SearchBar from "../components/SearchBar";
import { useAuth } from "../hooks/useAuth";

import { aromas, categories } from "../data/aromas";
import { spacing } from "../styles/spacing";
import { filterAromas } from "../utils/filterAromas";

export default function AromasScreen({
  theme,
  compactCards,
  favorites,
  favoritesOnly,
  onToggleFavorite,
  showEmojis,
  enableAnimations,
}) {
  const insets = useSafeAreaInsets();
  const { currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedAroma, setSelectedAroma] = useState(null);

  const filtered = useMemo(
    () => filterAromas(aromas, searchQuery, selectedCategory),
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
        data={visibleAromas}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item, index }) => (
          <AromaCard
            title={item.title}
            category={item.category}
            intensity={item.intensity}
            shortDescription={item.shortDescription}
            emoji={showEmojis !== false ? item.emoji : ""}
            theme={theme}
            compact={compactCards}
            onPress={() => setSelectedAroma(item)}
            favorited={favorites.includes(item.id)}
            onToggleFavorite={() => onToggleFavorite(item.id)}
            enableAnimations={enableAnimations}
            index={index}
          />
        )}
      />

      {selectedAroma && (
        <AromaModal
          visible={!!selectedAroma}
          aroma={selectedAroma}
          onClose={() => setSelectedAroma(null)}
          theme={theme}
          enableAnimations={enableAnimations}
          currentUser={currentUser}
        />
      )}
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
