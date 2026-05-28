import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../hooks/useTheme";
import { useAuth } from "../hooks/useAuth";
import useAromaDetails from "../hooks/useAromaDetails";
import useImageUpload from "../hooks/useImageUpload";
import EmptyState from "../components/EmptyState";
import ConfirmModal from "../components/common/ConfirmModal";
import ImageSection from "../components/details/ImageSection";
import DetailRow from "../components/details/DetailRow";
import { styles } from "../styles/screens/aromaDetailsStyles";

export default function AromaDetailsScreen({ route, navigation }) {
  const { aromaId } = route.params;
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { currentUser } = useAuth();

  const {
    aroma, setAroma, loading, isOwner,
    dots, createdDate, handleShare, handleCalendarReminder,
  } = useAromaDetails(aromaId, currentUser);

  const {
    previewUri, showConfirm,
    pickImage, confirmImage, cancelImage, removeImage,
  } = useImageUpload(aroma, setAroma);

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

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={[styles.backText, { color: theme.accent }]}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.headerActions}>
          <TouchableOpacity activeOpacity={0.7} onPress={handleShare} style={styles.headerActionBtn}>
            <Text style={{ fontSize: 18 }}>📤</Text>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.7} onPress={handleCalendarReminder} style={styles.headerActionBtn}>
            <Text style={{ fontSize: 18 }}>📅</Text>
          </TouchableOpacity>
        </View>
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

        <ImageSection
          aroma={aroma}
          isOwner={isOwner}
          previewUri={previewUri}
          pickImage={pickImage}
          removeImage={removeImage}
          theme={theme}
        />

        <View style={styles.intensityRow}>
          <Text style={[styles.intensityLabel, { color: theme.textSecondary, fontSize: 13 * theme.fontScale }]}>Intensity</Text>
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

        <DetailRow label="Mood" value={aroma.mood || "—"} valueColor={theme.accent} theme={theme} />
        <DetailRow label="Origin" value={aroma.origin || "Custom creation"} theme={theme} />

        {aroma.recommendedUsage && (
          <DetailRow label="Best for" value={aroma.recommendedUsage} theme={theme} />
        )}

        {(aroma.interestingFact || aroma.predominance) && (
          <View style={[styles.moreInfoSection, { borderTopColor: theme.border }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>More Info</Text>

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
                <Text style={[styles.predominanceLabel, { color: theme.text }]}>Predominance</Text>
                <Text style={[styles.predominanceValue, { color: theme.text }]}>
                  {aroma.predominance}
                </Text>
              </View>
            )}
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

        {aroma.isCustom === undefined && (
          <Text style={[styles.ownerText, { color: theme.textSecondary, fontSize: 12 * theme.fontScale, marginTop: 8 }]}>
            🌿 Built-in aroma · part of the AromaFlow library
          </Text>
        )}
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


