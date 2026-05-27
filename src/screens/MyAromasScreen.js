import { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import AromaModal from "../components/AromaModal";
import CategoryFilter from "../components/CategoryFilter";
import ConfirmationModal from "../components/ConfirmationModal";
import EmptyState from "../components/EmptyState";
import ScreenHeader from "../components/ScreenHeader";
import SearchBar from "../components/SearchBar";

import { categories } from "../data/aromas";
import { useAuth } from "../context/AuthContext";
import { shadows } from "../styles/shadows";
import { spacing, borderRadius } from "../styles/spacing";

function CustomAromaCard({
  item,
  theme,
  onPress,
  onDelete,
  favorited,
  onToggleFavorite,
  enableAnimations,
  onToggleVisibility,
}) {
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
            { backgroundColor: theme.card, shadowColor: theme.shadow },
            shadows.card,
          ]}
        >
          <View
            style={[styles.emojiBox, { backgroundColor: theme.bg }]}
          >
            <Text style={styles.emoji}>{item.emoji || ""}</Text>
          </View>

          <View style={styles.content}>
            <View style={styles.header}>
              <View style={styles.titleRow}>
                <Text
                  numberOfLines={1}
                  style={[styles.title, { color: theme.text }]}
                >
                  {item.title || ""}
                </Text>

                <View
                  style={[
                    styles.customBadge,
                    { backgroundColor: theme.accentLight, shadowColor: theme.accent },
                  ]}
                >
                  <Text
                    style={[
                      styles.customBadgeText,
                      { color: theme.accent },
                    ]}
                  >
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
                  style={[
                    styles.favorite,
                    favorited && styles.favoriteActive,
                  ]}
                >
                  {favorited ? "❤️" : "🤍"}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.badgeRow}>
              <View
                style={[
                  styles.badge,
                  { backgroundColor: theme.accentLight },
                ]}
              >
                <Text
                  style={[styles.badgeText, { color: theme.accent }]}
                >
                  {item.category || ""}
                </Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => onToggleVisibility(item)}
                style={[
                  styles.visibilityToggle,
                  { backgroundColor: theme.accentLight },
                ]}
              >
                <Text style={styles.visibilityIcon}>
                  {item.visibility === "public" ? "🌍" : "🔒"}
                </Text>

                <Text
                  style={[
                    styles.visibilityLabel,
                    { color: theme.accent },
                  ]}
                >
                  {item.visibility === "public" ? "PUBLIC" : "PRIVATE"}
                </Text>
              </TouchableOpacity>
            </View>

            <Text
              numberOfLines={2}
              style={[
                styles.description,
                { color: theme.textSecondary },
              ]}
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
  onUpdateAroma,
  enableAnimations,
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
      <View
        style={[
          styles.container,
          { backgroundColor: theme.bg, paddingTop: insets.top + 12 },
        ]}
      >
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  list: {
    paddingTop: spacing.xs,
    paddingBottom: 120,
  },

  card: {
    flexDirection: "row",
    borderRadius: borderRadius.xxl,
    padding: 14,
    marginHorizontal: 14,
    marginVertical: 6,
  },

  emojiBox: {
    width: 58,
    height: 58,
    borderRadius: borderRadius.md,
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
    borderRadius: borderRadius.sm,
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
    gap: 6,
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },

  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  visibilityToggle: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
    gap: 4,
  },

  visibilityIcon: {
    fontSize: 11,
  },

  visibilityLabel: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.5,
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
