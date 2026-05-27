import { useEffect, useMemo, useRef, useState } from "react";
import { Animated, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import AromaModal from "../components/AromaModal";
import CategoryFilter from "../components/CategoryFilter";
import ConfirmationModal from "../components/ConfirmationModal";
import EmptyState from "../components/EmptyState";
import SearchBar from "../components/SearchBar";

import { categories } from "../data/aromas";

function CustomAromaCard({ item, theme, onPress, onDelete, favorited, onToggleFavorite, enableAnimations }) {
  const scale = useRef(new Animated.Value(1)).current;
  const fadeIn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const dur = enableAnimations ? 400 : 0;
    Animated.timing(fadeIn, {
      toValue: 1,
      duration: dur,
      useNativeDriver: true,
    }).start();
  }, []);

  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: enableAnimations ? 0.97 : 1,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };
  const dots = Array.from({ length: 5 }, (_, i) => i < (item.intensity || 0));

  return (
    <Animated.View style={{ transform: [{ scale }], opacity: fadeIn }}>
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      >
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.card,
              shadowColor: theme.shadow,
            },
          ]}
        >
          <View style={[styles.emojiBox, { backgroundColor: theme.bg }]}>
            <Text style={styles.emoji}>{item.emoji || ""}</Text>
          </View>

          <View style={styles.content}>
            <View style={styles.header}>
              <View style={styles.titleRow}>
                <Text
                  numberOfLines={1}
                  style={[styles.title, { color: theme.text, fontSize: 17 * theme.fontScale }]}
                >
                  {item.title || ""}
                </Text>

                <View
                  style={[
                    styles.customBadge,
                    {
                      backgroundColor: theme.accentLight,
                      shadowColor: theme.accent,
                    },
                  ]}
                >
                  <Text style={[styles.customBadgeText, { color: theme.accent, fontSize: 9 * theme.fontScale }]}>
                    CUSTOM
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={onToggleFavorite}
                style={styles.favoriteButton}
              >
                <Text
                  style={[styles.favorite, favorited && styles.favoriteActive]}
                >
                  {favorited ? "❤️" : "🤍"}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.badgeRow}>
              <View style={[styles.badge, { backgroundColor: theme.accentLight }]}>
                <Text style={[styles.badgeText, { color: theme.accent, fontSize: 11 * theme.fontScale }]}>
                  {item.category || ""}
                </Text>
              </View>
            </View>

            <Text
              numberOfLines={2}
              style={[styles.description, { color: theme.textSecondary, fontSize: 13 * theme.fontScale, lineHeight: 19 * theme.fontScale }]}
            >
              {item.shortDescription || ""}
            </Text>

            <View style={styles.footer}>
              <View style={styles.dots}>
                {dots.map((filled, i) => (
                  <View
                    key={i}
                    style={[
                      styles.dot,
                      {
                        backgroundColor: filled
                          ? theme.accent
                          : theme.accentLight,
                      },
                    ]}
                  />
                ))}
              </View>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={onDelete}
                style={styles.deleteButton}
              >
                <Text style={styles.deleteIcon}>🗑️</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function MyAromasScreen({
  theme,
  customAromas,
  favorites,
  onToggleFavorite,
  onDeleteAroma,
  enableAnimations,
}) {
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
    if (deleteTarget) {
      onDeleteAroma(deleteTarget.id);
      setDeleteTarget(null);
    }
  }

  if (customAromas.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.bg }]}>
        <EmptyState
          emoji="🧪"
          title="No custom aromas yet"
          subtitle="Create your first aroma note"
          theme={theme}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
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
          />
        )}
        ListEmptyComponent={
          <EmptyState
            emoji="🔍"
            title="No matches found"
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
        />
      )}

      <ConfirmationModal
        visible={!!deleteTarget}
        title="Delete Aroma"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  list: {
    paddingTop: 4,
    paddingBottom: 120,
  },

  card: {
    flexDirection: "row",
    borderRadius: 22,
    padding: 14,
    marginHorizontal: 14,
    marginVertical: 6,

    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },

  emojiBox: {
    width: 58,
    height: 58,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  emoji: {
    fontSize: 28,
  },

  content: {
    flex: 1,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 5,
  },

  titleRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginRight: 8,
  },

  title: {
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: -0.3,
    flexShrink: 1,
  },

  customBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },

  customBadgeText: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.5,
  },

  favoriteButton: {
    paddingLeft: 8,
    paddingVertical: 2,
  },

  favorite: {
    fontSize: 18,
    opacity: 0.5,
  },

  favoriteActive: {
    opacity: 1,
  },

  badgeRow: {
    flexDirection: "row",
    marginBottom: 5,
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9,
  },

  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  description: {
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 9,
  },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  dots: {
    flexDirection: "row",
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },

  deleteButton: {
    padding: 4,
  },

  deleteIcon: {
    fontSize: 16,
    opacity: 0.6,
  },
});
