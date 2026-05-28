import { useMemo, useState } from "react";
import { FlatList, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import AromaModal from "../components/AromaModal";
import CategoryFilter from "../components/CategoryFilter";
import ConfirmationModal from "../components/ConfirmationModal";
import EmptyState from "../components/EmptyState";
import ScreenHeader from "../components/ScreenHeader";
import SearchBar from "../components/SearchBar";
import CustomAromaCard from "../components/aroma/CustomAromaCard";

import { categories } from "../data/aromas";
import { useAuth } from "../hooks/useAuth";
import { styles } from "../styles/screens/myAromasStyles";

export default function MyAromasScreen({
  theme, customAromas, favorites, onToggleFavorite,
  onDeleteAroma, onUpdateAroma, enableAnimations,
}) {
  const insets = useSafeAreaInsets();
  const { currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedAroma, setSelectedAroma] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return customAromas.filter((aroma) => {
      const matchesSearch =
        query === "" ||
        aroma.title.toLowerCase().includes(query) ||
        aroma.category.toLowerCase().includes(query);

      const matchesCategory =
        selectedCategory === "All" || aroma.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, customAromas]);

  function handleConfirmDelete() {
    if (!deleteTarget) return;

    onDeleteAroma(deleteTarget.id);
    setDeleteTarget(null);
  }

  function handleToggleVisibility(aroma) {
    const newVis = aroma.visibility === "public" ? "private" : "public";

    onUpdateAroma(aroma.id, { visibility: newVis });
  }

  if (customAromas.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.bg, paddingTop: insets.top + 12 }]}>
        <EmptyState
          emoji="🧪" title="No custom aromas yet"
          subtitle="Create your first aroma note"
          theme={theme}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <ScreenHeader
        title="My Aromas"
        subtitle="Your personal aroma collection"
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

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <CustomAromaCard
            item={item}
            theme={theme}
            onPress={() => setSelectedAroma(item)}
            onDelete={() => setDeleteTarget(item)}
            favorited={favorites.includes(item.id)}
            onToggleFavorite={() => onToggleFavorite(item.id)}
            enableAnimations={enableAnimations}
            onToggleVisibility={handleToggleVisibility}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            emoji="🔍" title="No matches found"
            subtitle="Try a different search or category"
            theme={theme}
          />
        }
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

      <ConfirmationModal
        visible={!!deleteTarget}
        title="Delete Aroma"
        message={`Are you sure you want to delete "${deleteTarget?.title}"?`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
        theme={theme}
        destructive
        enableAnimations={enableAnimations}
      />
    </View>
  );
}
