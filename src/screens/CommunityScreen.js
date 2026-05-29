import { useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../hooks/useAuth";
import { useAromas } from "../hooks/useAromas";
import { useTheme } from "../hooks/useTheme";
import AromaCard from "../components/AromaCard";
import AromaModal from "../components/AromaModal";
import ConfirmationModal from "../components/ConfirmationModal";
import EmptyState from "../components/EmptyState";
import ScreenHeader from "../components/ScreenHeader";
import SearchBar from "../components/SearchBar";
import { spacing, borderRadius } from "../styles/spacing";

export default function CommunityScreen() {
  const insets = useSafeAreaInsets();
  const { currentUser } = useAuth();
  const { theme, compactCards, showEmojis, enableAnimations } = useTheme();
  const { favorites, onToggleFavorite, publicAromas, onUpdateAroma, onDeleteAroma } = useAromas();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAroma, setSelectedAroma] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return publicAromas.filter((aroma) => {
      return query === "" ||
        aroma.title.toLowerCase().includes(query) ||
        aroma.category.toLowerCase().includes(query);
    });
  }, [searchQuery, publicAromas]);

  function handleToggleVisibility(aroma) {
    onUpdateAroma(aroma.id, { visibility: aroma.visibility === "public" ? "private" : "public" });
  }

  function handleConfirmDelete() {
    if (!deleteTarget) return;

    onDeleteAroma(deleteTarget.id);
    setDeleteTarget(null);

    if (selectedAroma?.id === deleteTarget.id) {
      setSelectedAroma(null);
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <ScreenHeader title="Community" subtitle="Public aromas from the community" theme={theme} style={{ paddingTop: insets.top + 12 }} />

      <SearchBar query={searchQuery} onChange={setSearchQuery} theme={theme} />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item, index }) => {
          const isOwner = currentUser && item.ownerId === currentUser.uid;

          return (
            <View>
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

              <View style={styles.ownerRow}>
                <Text style={styles.ownerAvatar}>
                  {item.ownerName?.[0] || "👤"}
                </Text>

                <Text style={[styles.ownerText, { color: theme.accent }]}>
                  {isOwner ? "Created by You" : `Created by ${item.ownerName || "Unknown"}`}
                </Text>

                {isOwner ? (
                  <View style={styles.ownerActions}>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => handleToggleVisibility(item)}
                      style={[styles.actionBadge, { backgroundColor: theme.accentLight }]}
                    >
                      <Text style={[styles.actionBadgeText, { color: theme.accent }]}>
                        {item.visibility === "public" ? "PRIVATE" : "PUBLIC"}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={0.7} onPress={() => setDeleteTarget(item)} style={styles.deleteBtn}>
                      <Text style={styles.deleteIcon}>🗑️</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={[styles.actionBadge, { backgroundColor: theme.accentLight }]}>
                    <Text style={[styles.actionBadgeText, { color: theme.accent }]}>PUBLIC</Text>
                  </View>
                )}
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <EmptyState emoji="🌍" title="No public aromas yet" subtitle="Create a public aroma to share with the community" theme={theme} />
        }
      />

      {selectedAroma && (
        <AromaModal visible={!!selectedAroma} aroma={selectedAroma} onClose={() => setSelectedAroma(null)} theme={theme} enableAnimations={enableAnimations} currentUser={currentUser} />
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
  container: { flex: 1 },
  list: { paddingTop: spacing.xs, paddingBottom: 120 },
  ownerRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: spacing.lg, paddingBottom: 6, marginTop: -6, gap: 6, flexWrap: "wrap" },
  ownerAvatar: { fontSize: 14 },
  ownerText: { fontSize: 12, fontWeight: "700", letterSpacing: 0.2 },
  ownerActions: { flexDirection: "row", alignItems: "center", gap: 6 },
  actionBadge: { paddingHorizontal: spacing.sm, paddingVertical: 3, borderRadius: borderRadius.sm },
  actionBadgeText: { fontSize: 9, fontWeight: "800", letterSpacing: 0.5 },
  deleteBtn: { padding: 2 },
  deleteIcon: { fontSize: 14, opacity: 0.6 },
});
