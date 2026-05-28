import { useEffect, useState } from "react";
import {
  ActivityIndicator, Image, ScrollView, Text,
  TouchableOpacity, View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { getAromaById } from "../firebase/aromaService";
import useImageUpload from "../hooks/useImageUpload";
import EmptyState from "../components/EmptyState";
import { styles } from "../styles/screens/aromaDetailsStyles";

export default function AromaDetailsScreen({ route, navigation }) {
  const { aromaId } = route.params;
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { currentUser } = useAuth();

  const [aroma, setAroma] = useState(null);
  const [loading, setLoading] = useState(true);
  const { uploading, uploadProgress, pickAndUpload, removeImage } = useImageUpload(aroma, setAroma);

  const isOwner = aroma && currentUser && aroma.ownerId === currentUser.uid;

  useEffect(() => {
    (async () => {
      try {
        const data = await getAromaById(aromaId);
        setAroma(data);
      } catch (e) {
        console.warn("Failed to load aroma", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [aromaId]);

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.bg }]}>
        <ActivityIndicator size="large" color={theme.accent} style={styles.loader} />
      </View>
    );
  }

  if (!aroma) {
    return (
      <View style={[styles.container, { backgroundColor: theme.bg }]}>
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={[styles.backText, { color: theme.accent }]}>← Back</Text>
          </TouchableOpacity>
        </View>
        <EmptyState
          emoji="🔍" title="Aroma not found"
          subtitle="This aroma may have been deleted or is no longer available."
          theme={theme}
        />
      </View>
    );
  }

  const dots = Array.from({ length: 5 }, (_, i) => i < (aroma.intensity || 0));

  const createdDate = aroma.createdAt
    ? new Date(aroma.createdAt).toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric",
      })
    : null;

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={[styles.backText, { color: theme.accent }]}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.screenTitle, { color: theme.text }]}>Aroma Details</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={[styles.emojiBox, { backgroundColor: theme.accentLight }]}>
          <Text style={styles.emoji}>{aroma.emoji || "🌸"}</Text>
        </View>

        <Text style={[styles.title, { color: theme.text, fontSize: 28 * theme.fontScale }]}>
          {aroma.title || ""}
        </Text>

        <View style={[styles.badge, { backgroundColor: theme.accentLight }]}>
          <Text style={[styles.badgeText, { color: theme.accent, fontSize: 13 * theme.fontScale }]}>
            {aroma.category || ""}
          </Text>
        </View>

        {aroma.imageUrl ? (
          <View style={styles.imageSection}>
            <Image source={{ uri: aroma.imageUrl }} style={styles.aromaImage} resizeMode="cover" />

            {isOwner && (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={removeImage}
                style={[styles.imageActionBtn, { backgroundColor: theme.error }]}
              >
                <Text style={styles.imageActionText}>Remove Image</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          isOwner && (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={pickAndUpload}
              style={[styles.attachButton, { backgroundColor: theme.accentLight, borderColor: theme.accent }]}
              disabled={uploading}
            >
              {uploading ? (
                <View style={styles.uploadingRow}>
                  <ActivityIndicator size="small" color={theme.accent} />
                  <Text style={[styles.attachText, { color: theme.accent }]}>
                    Uploading... {Math.round(uploadProgress * 100)}%
                  </Text>
                </View>
              ) : (
                <Text style={[styles.attachText, { color: theme.accent }]}>+ Attach Image</Text>
              )}
            </TouchableOpacity>
          )
        )}

        <View style={styles.intensityRow}>
          <Text style={[styles.intensityLabel, { color: theme.textSecondary, fontSize: 13 * theme.fontScale }]}>
            Intensity
          </Text>
          <View style={styles.dots}>
            {dots.map((filled, i) => (
              <View key={i} style={[styles.dot, { backgroundColor: filled ? theme.accent : theme.accentLight }]} />
            ))}
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        <Text style={[styles.description, { color: theme.textSecondary, fontSize: 15 * theme.fontScale, lineHeight: 23 * theme.fontScale }]}>
          {aroma.fullDescription || aroma.shortDescription || ""}
        </Text>

        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: theme.text, fontSize: 13 * theme.fontScale }]}>Mood</Text>
          <Text style={[styles.detailValue, { color: theme.accent }]}>{aroma.mood || "—"}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: theme.text, fontSize: 13 * theme.fontScale }]}>Origin</Text>
          <Text style={[styles.detailValue, { color: theme.textSecondary }]}>{aroma.origin || "Custom creation"}</Text>
        </View>

        {aroma.recommendedUsage && (
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.text, fontSize: 13 * theme.fontScale }]}>Best for</Text>
            <Text style={[styles.detailValue, { color: theme.textSecondary }]}>{aroma.recommendedUsage}</Text>
          </View>
        )}

        {aroma.visibility && (
          <View style={[styles.visibilityBadge, { backgroundColor: theme.accentLight }]}>
            <Text style={[styles.visibilityText, { color: theme.accent }]}>
              {aroma.visibility === "public" ? "🌍 Public" : "🔒 Private"}
            </Text>
          </View>
        )}

        {aroma.ownerName && (
          <Text style={[styles.ownerText, { color: theme.textSecondary, fontSize: 12 * theme.fontScale }]}>
            {currentUser && aroma.ownerId === currentUser.uid
              ? "Created by You"
              : `Created by ${aroma.ownerName}`}
            {createdDate ? ` · ${createdDate}` : ""}
          </Text>
        )}
      </ScrollView>
    </View>
  );
}
