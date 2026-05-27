import { useMemo, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";

import AromaCard from "../components/AromaCard";
import AromaModal from "../components/AromaModal";
import CategoryFilter from "../components/CategoryFilter";
import SearchBar from "../components/SearchBar";

import { aromas, categories } from "../data/aromas";

export default function AromasScreen({
  theme,
  compactCards,
  favorites,
  favoritesOnly,
  onToggleFavorite,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedAroma, setSelectedAroma] = useState(null);

  const filtered = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return aromas.filter((aroma) => {
      const matchesSearch =
        query === "" ||
        aroma.title.toLowerCase().includes(query) ||
        aroma.category.toLowerCase().includes(query);

      const matchesCategory =
        selectedCategory === "All" || aroma.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const visibleAromas = favoritesOnly
    ? filtered.filter((aroma) => favorites.includes(aroma.id))
    : filtered;

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <SearchBar query={searchQuery} onChange={setSearchQuery} theme={theme} />

      <CategoryFilter
        categories={categories}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
        theme={theme}
      />

      <FlatList
        data={visibleAromas}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <AromaCard
            title={item.title}
            category={item.category}
            intensity={item.intensity}
            shortDescription={item.shortDescription}
            emoji={item.emoji}
            theme={theme}
            compact={compactCards}
            onPress={() => setSelectedAroma(item)}
            favorited={favorites.includes(item.id)}
            onToggleFavorite={() => onToggleFavorite(item.id)}
          />
        )}
      />

      {selectedAroma && (
        <AromaModal
          visible={!!selectedAroma}
          aroma={selectedAroma}
          onClose={() => setSelectedAroma(null)}
          theme={theme}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  list: {
    paddingTop: 4,
    paddingBottom: 28,
  },
});
