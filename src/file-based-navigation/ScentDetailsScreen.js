import {
  ActivityIndicator,
  ScrollView,
  Text,
  Pressable,
  View,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { ScentImage } from "./ScentImage";
import { ScentPhotoCredit } from "./ScentPhotoCredit";
import { getScentById, getPhotoSubject } from "./scentCatalog";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import EmptyState from "../components/EmptyState";
import ConfirmModal from "../components/common/ConfirmModal";
import DetailRow from "../components/details/DetailRow";
import ImageSection from "../components/details/ImageSection";
import useAromaDetails from "../hooks/useAromaDetails";
import { useAuth } from "../hooks/useAuth";
import useImageUpload from "../hooks/useImageUpload";
import { useTheme } from "../hooks/useTheme";
import { styles } from "../styles/screens/aromaDetailsStyles";
import { borderRadius, spacing } from "../styles/spacing";

export default function ScentDetailsScreen({ aromaId }) {
  const router = useRouter();
  const catalogScent = aromaId ? getScentById(aromaId) : undefined;
  const goBack = () =>
    router.canGoBack() ? router.back() : router.replace("/");
  const insets = useSafeAreaInsets();
  const { theme, showEmojis } = useTheme();
  const { currentUser } = useAuth();

  const {
    aroma,
    setAroma,
    loading,
    isOwner,
    dots,
    createdDate,
    handleShare,
    handleCalendarReminder,
  } = useAromaDetails(aromaId, currentUser);

  const {
    previewUri,
    showConfirm,
    isSaving,
    pickImage,
    confirmImage,
    cancelImage,
    removeImage,
  } = useImageUpload(aroma, setAroma);

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.bg }]}>
        <Stack.Screen
          options={{ title: catalogScent?.title || "Loading aroma" }}
        />
        <ActivityIndicator
          size="large"
          color={theme.accent}
          style={styles.loader}
        />
      </View>
    );
  }

  if (!aroma) {
    return (
      <View style={[styles.container, { backgroundColor: theme.bg }]}>
        <Stack.Screen options={{ title: "Aroma not found" }} />
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            onPress={goBack}
            style={({ pressed }) => [
              styles.backButton,
              pressed && { opacity: 0.7 },
            ]}
          >
            <Text style={[styles.backText, { color: theme.accent }]}>
              ← Back
            </Text>
          </Pressable>
        </View>
        <EmptyState
          emoji="🔍"
          title="Aroma not found"
          subtitle="This aroma may have been deleted or is no longer available"
          theme={theme}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <Stack.Screen options={{ title: aroma.title }} />
      <View style={[styles.header, { justifyContent: "flex-end" }]}>
        <View style={styles.headerActions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Share aroma"
            onPress={handleShare}
            style={({ pressed }) => [
              styles.headerActionBtn,
              pressed && { opacity: 0.7 },
            ]}
          >
            <Text style={{ fontSize: 18 }}>📤</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Add calendar reminder"
            onPress={handleCalendarReminder}
            style={({ pressed }) => [
              styles.headerActionBtn,
              pressed && { opacity: 0.7 },
            ]}
          >
            <Text style={{ fontSize: 18 }}>📅</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + spacing.xl },
        ]}
      >
        {!previewUri && !aroma.imageUri && (
          <ScentImage
            subject={getPhotoSubject(aroma)}
            title={aroma.title}
            emoji={showEmojis !== false ? aroma.emoji || "" : ""}
            height={240}
          />
        )}

        <Text
          style={[
            styles.title,
            { color: theme.text, fontSize: 28 * theme.fontScale },
          ]}
        >
          {aroma.title || ""}
        </Text>

        <View style={[styles.badge, { backgroundColor: theme.accentLight }]}>
          <Text
            style={[
              styles.badgeText,
              { color: theme.accent, fontSize: 13 * theme.fontScale },
            ]}
          >
            {aroma.category || ""}
          </Text>
        </View>

        <ImageSection
          aroma={aroma}
          isOwner={isOwner}
          previewUri={previewUri}
          isSaving={isSaving}
          pickImage={pickImage}
          removeImage={removeImage}
          theme={theme}
        />

        <View style={styles.intensityRow}>
          <Text
            style={[
              styles.intensityLabel,
              { color: theme.textSecondary, fontSize: 13 * theme.fontScale },
            ]}
          >
            Intensity
          </Text>
          <View style={styles.dots}>
            {dots.map((filled, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  {
                    backgroundColor: filled ? theme.accent : theme.accentLight,
                  },
                ]}
              />
            ))}
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        <Text
          style={[
            styles.description,
            {
              color: theme.textSecondary,
              fontSize: 15 * theme.fontScale,
              lineHeight: 23 * theme.fontScale,
            },
          ]}
        >
          {aroma.fullDescription || aroma.shortDescription || ""}
        </Text>

        <DetailRow
          label="Mood"
          value={aroma.mood || "—"}
          valueColor={theme.accent}
          theme={theme}
        />
        <DetailRow
          label="Origin"
          value={aroma.origin || "Custom creation"}
          theme={theme}
        />
        {catalogScent && (
          <DetailRow
            label="Sample discovery rating"
            value={`★ ${catalogScent.rating.toFixed(1)} / 5`}
            theme={theme}
          />
        )}

        {aroma.recommendedUsage && (
          <DetailRow
            label="Best for"
            value={aroma.recommendedUsage}
            theme={theme}
          />
        )}

        {(aroma.interestingFact || aroma.predominance) && (
          <View
            style={[styles.moreInfoSection, { borderTopColor: theme.border }]}
          >
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              More Info
            </Text>

            {aroma.interestingFact && (
              <View style={[styles.factBox, { backgroundColor: theme.card }]}>
                <Text style={styles.factIcon}>💡</Text>
                <Text style={[styles.factText, { color: theme.text }]}>
                  {aroma.interestingFact}
                </Text>
              </View>
            )}

            {aroma.predominance && (
              <View style={styles.predominanceRow}>
                <Text style={[styles.predominanceLabel, { color: theme.text }]}>
                  Predominance
                </Text>
                <Text style={[styles.predominanceValue, { color: theme.text }]}>
                  {aroma.predominance}
                </Text>
              </View>
            )}
          </View>
        )}

        {aroma.visibility && (
          <View
            style={[
              styles.visibilityBadge,
              { backgroundColor: theme.accentLight },
            ]}
          >
            <Text style={[styles.visibilityText, { color: theme.accent }]}>
              {aroma.visibility === "public" ? "🌍 Public" : "🔒 Private"}
            </Text>
          </View>
        )}

        {aroma.ownerName && (
          <Text
            style={[
              styles.ownerText,
              { color: theme.textSecondary, fontSize: 12 * theme.fontScale },
            ]}
          >
            {currentUser && aroma.ownerId === currentUser.uid
              ? "Created by You"
              : `Created by ${aroma.ownerName}`}
            {createdDate ? ` · ${createdDate}` : ""}
          </Text>
        )}

        {aroma.isCustom === undefined && (
          <Text
            style={[
              styles.ownerText,
              {
                color: theme.textSecondary,
                fontSize: 12 * theme.fontScale,
                marginTop: 8,
              },
            ]}
          >
            🌿 Built-in aroma · part of the AromaFlow library
          </Text>
        )}
        {!previewUri && !aroma.imageUri && (
          <ScentPhotoCredit
            subject={getPhotoSubject(aroma)}
            title={aroma.title}
          />
        )}
        <Pressable
          accessibilityRole="button"
          onPress={goBack}
          style={({ pressed }) => [
            {
              padding: spacing.md,
              alignItems: "center",
              backgroundColor: theme.accentLight,
              borderRadius: borderRadius.md,
              marginTop: spacing.md,
            },
            pressed && { opacity: 0.8 },
          ]}
        >
          <Text style={{ color: theme.accent, fontWeight: "700" }}>
            ← Back to scent catalog
          </Text>
        </Pressable>
      </ScrollView>

      <ConfirmModal
        visible={showConfirm}
        title="Set Image"
        message="Use this image for your aroma?"
        confirmText="Use"
        cancelText="Cancel"
        onConfirm={confirmImage}
        onCancel={cancelImage}
      />
    </View>
  );
}
